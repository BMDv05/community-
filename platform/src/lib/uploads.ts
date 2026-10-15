export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_EXTS = ["png", "jpg", "jpeg", "webp", "gif"] as const;

/** Sniff the image type from magic bytes. Returns the extension or null. */
export function detectImageExt(bytes: Uint8Array): string | null {
  const sig = (n: number[]) => n.every((b, i) => bytes[i] === b);
  if (sig([0x89, 0x50, 0x4e, 0x47])) return "png";
  if (sig([0xff, 0xd8, 0xff])) return "jpg";
  if (sig([0x47, 0x49, 0x46, 0x38])) return "gif";
  if (
    bytes.length >= 12 &&
    sig([0x52, 0x49, 0x46, 0x46]) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  )
    return "webp";
  return null;
}

export function validateImageUpload(buf: Buffer, mime: string): { ok: true; ext: string } | { ok: false; error: string } {
  if (buf.length === 0) return { ok: false, error: "Empty file." };
  if (buf.length > MAX_UPLOAD_BYTES) return { ok: false, error: "File too large (max 5 MB)." };
  const ext = detectImageExt(new Uint8Array(buf));
  if (!ext) return { ok: false, error: "Only PNG, JPEG, WEBP or GIF images are allowed." };
  const mimeOk = ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(mime.toLowerCase());
  if (!mimeOk) return { ok: false, error: "Invalid MIME type." };
  return { ok: true, ext };
}
