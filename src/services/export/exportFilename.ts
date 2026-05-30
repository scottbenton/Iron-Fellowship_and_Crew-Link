export type ExportFilenameTracker = Map<string, number>;

export function createExportFilenameTracker(): ExportFilenameTracker {
  return new Map();
}

/**
 * Convert user-controlled names into filesystem-safe, readable ASCII stems.
 * Falls back to the record ID when the name has no safe characters.
 */
export function slugifyExportName(name: string, fallbackId: string): string {
  const fallback = fallbackId.trim() || "export";
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length > 0) {
    return slug;
  }

  return fallback
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export";
}

export function buildUniqueExportPath(params: {
  directory: string;
  name: string;
  fallbackId: string;
  extension: "json";
  tracker: ExportFilenameTracker;
}): string {
  const { directory, name, fallbackId, extension, tracker } = params;
  const stem = slugifyExportName(name, fallbackId);
  const trackerKey = `${directory}/${stem}`;
  const index = (tracker.get(trackerKey) ?? 0) + 1;
  tracker.set(trackerKey, index);

  const indexedStem = index === 1 ? stem : `${stem}-${index}`;
  return `${directory}/${indexedStem}.${extension}`;
}
