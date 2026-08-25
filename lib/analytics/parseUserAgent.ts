export type DeviceType = "mobile" | "tablet" | "desktop";

/** Small local classifier so we don't need a UA-parsing dependency. */
export function parseUserAgent(ua: string | null): {
  device_type: DeviceType | null;
  browser: string | null;
  os: string | null;
} {
  if (!ua) return { device_type: null, browser: null, os: null };

  const device_type: DeviceType =
    /ipad|tablet/i.test(ua) && !/mobile/i.test(ua)
      ? "tablet"
      : /mobi|android|iphone/i.test(ua)
        ? "mobile"
        : "desktop";

  let browser: string | null = null;
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let os: string | null = null;
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod|ios/i.test(ua)) os = "iOS";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device_type, browser, os };
}
