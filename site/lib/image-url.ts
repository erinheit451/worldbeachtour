/**
 * Convert an `upload.wikimedia.org/.../File.jpg` direct URL to a `thumb`
 * variant at the requested width. Wikimedia's thumb endpoint is:
 *
 *   /wikipedia/commons/thumb/<a>/<ab>/<File>/<width>px-<File>
 *
 * where the original lives at /wikipedia/commons/<a>/<ab>/<File>. SVGs need
 * a `.png` suffix on the thumb. Non-Wikimedia URLs and already-thumbnail
 * URLs are returned unchanged.
 */
export function thumbUrl(url: string, width = 640): string {
  if (!url) return url;
  if (!url.includes("upload.wikimedia.org/wikipedia/")) return url;
  if (url.includes("/thumb/")) return url;

  const m = url.match(
    /^(https?:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z]+)\/([0-9a-f])\/([0-9a-f]{2})\/([^/?#]+)$/i
  );
  if (!m) return url;
  const [, base, a, ab, file] = m;
  const thumbFile = file.toLowerCase().endsWith(".svg")
    ? `${file}.png`
    : file;
  return `${base}/thumb/${a}/${ab}/${file}/${width}px-${thumbFile}`;
}
