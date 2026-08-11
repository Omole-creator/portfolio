import { createClient } from "./supabase/client";

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const MAX_BYTES = 8 * 1024 * 1024;

/** Sends one image to the public blog-images bucket and returns its URL. */
export async function uploadImage(file: File): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "That file is not an image." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "That image is over 8MB. Try a smaller one." };
  }

  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) {
    // The usual cause is a missing insert policy on storage.objects.
    return {
      ok: false,
      error:
        "The image did not upload. Check that the blog-images upload policy exists in Supabase.",
    };
  }

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
