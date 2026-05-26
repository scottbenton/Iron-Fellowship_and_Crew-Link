export const EXPORT_SCHEMA_VERSION = 1;

export interface ExportManifest {
  schemaVersion: number;
  exportedAt: string;
  appVersion: string;
  categories: string[];
  source: {
    type: "world" | "campaign" | "character";
    id: string;
  };
}

export function buildManifest(params: {
  source: ExportManifest["source"];
  categories: string[];
  appVersion: string;
}): ExportManifest {
  return {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: params.appVersion,
    categories: [...params.categories].sort(),
    source: params.source,
  };
}

export function manifestToJSON(manifest: ExportManifest): string {
  return JSON.stringify(manifest, null, 2);
}
