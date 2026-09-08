import { readFile } from "node:fs/promises";
import path from "node:path";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const FROM_ADDRESS = "Omole Usuangbon <omoleusuangbon@gmail.com>";

/**
 * Exchanges the long-lived refresh token (from Google's OAuth Playground,
 * see CLAUDE.md) for a short-lived access token. Plain REST, no SDK -
 * matches how this repo talks to every other external API.
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("Gmail send is not configured (missing GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN).");
    return null;
  }

  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error(`Gmail token refresh failed: ${res.status} ${await res.text()}`);
      return null;
    }

    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (error) {
    console.error("Gmail token refresh errored:", error);
    return null;
  }
}

function base64UrlEncode(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function wrapBase64(base64: string): string {
  return base64.match(/.{1,76}/g)?.join("\r\n") ?? base64;
}

function buildMimeMessage(params: {
  to: string;
  subject: string;
  bodyText: string;
  attachmentBase64: string;
  attachmentFilename: string;
}): string {
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: ${FROM_ADDRESS}`,
    `To: ${params.to}`,
    `Subject: ${params.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=\"UTF-8\"",
    "Content-Transfer-Encoding: 7bit",
    "",
    params.bodyText,
    "",
    `--${boundary}`,
    `Content-Type: application/pdf; name="${params.attachmentFilename}"`,
    `Content-Disposition: attachment; filename="${params.attachmentFilename}"`,
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(params.attachmentBase64),
    "",
    `--${boundary}--`,
  ];
  return lines.join("\r\n");
}

type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the drafted cover letter, with the matching CV attached, to a
 * company's direct application email. Only called after the admin reviews
 * the draft and explicitly confirms - see app/admin/jobs/actions.ts. Free:
 * Gmail API sending has no cost within normal personal-account limits.
 */
export async function sendApplicationEmail(params: {
  to: string;
  subject: string;
  bodyText: string;
  cvPath: string; // public/ URL path, e.g. "/omole-usuangbon-growth-marketing-cv.pdf"
}): Promise<SendResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { ok: false, error: "Gmail is not connected. Check GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN." };
  }

  let attachmentBuffer: Buffer;
  try {
    attachmentBuffer = await readFile(path.join(process.cwd(), "public", params.cvPath));
  } catch (error) {
    console.error(`Could not read CV file at ${params.cvPath}:`, error);
    return { ok: false, error: "Could not read the CV file to attach." };
  }

  const raw = buildMimeMessage({
    to: params.to,
    subject: params.subject,
    bodyText: params.bodyText,
    attachmentBase64: attachmentBuffer.toString("base64"),
    attachmentFilename: path.basename(params.cvPath),
  });

  try {
    const res = await fetch(SEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: base64UrlEncode(Buffer.from(raw, "utf-8")) }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Gmail send failed: ${res.status} ${errorBody}`);
      return { ok: false, error: "Gmail rejected the send. Check the server logs for details." };
    }

    return { ok: true };
  } catch (error) {
    console.error("Gmail send errored:", error);
    return { ok: false, error: "Could not reach Gmail right now. Try again in a moment." };
  }
}
