/**
 * Returns true if the given Fabric.js canvas JSON contains at least one
 * user-uploaded photo (a non-frame image object).
 *
 * Used by CanvasEditor to guard undo/redo stack entries and prevent
 * replacing a design that already has artwork with an empty state.
 */
export function canvasJsonHasUserPhoto(json: string): boolean {
  try {
    const data = JSON.parse(json) as { objects?: Array<{ type?: string; isFrame?: boolean }> };
    return (data.objects ?? []).some((o) => {
      if (o.isFrame) return false;
      return String(o.type || '').toLowerCase() === 'image';
    });
  } catch {
    return false;
  }
}
