/**
 * Google Drive helpers. Accept any share URL a normal user pastes:
 *   https://drive.google.com/file/d/{ID}/view?usp=sharing
 *   https://drive.google.com/open?id={ID}
 *   https://drive.google.com/uc?id={ID}
 *   https://docs.google.com/document/d/{ID}/edit
 * ...and normalize to the embeddable preview form:
 *   https://drive.google.com/file/d/{ID}/preview
 *
 * Returns null if the input doesn't look like a Drive URL — caller decides
 * whether to render an <iframe> or a plain link.
 */
export function extractDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // /file/d/{ID}/... or /document/d/{ID}/...
  const pathMatch = trimmed.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]{10,})/);
  if (pathMatch) return pathMatch[1];
  // ?id={ID}
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (idMatch) return idMatch[1];
  return null;
}

export function toDrivePreviewUrl(url: string | null | undefined): string | null {
  const id = extractDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}
