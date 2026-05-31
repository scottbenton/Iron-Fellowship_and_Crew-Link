import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Exporter, ExportFile, ProgressCallback } from "./types";
import {
  buildManifest,
  ExportManifest,
  manifestToJSON,
} from "./manifest";

export interface BundleParams {
  exporters: Exporter[];
  source: ExportManifest["source"];
  categories: string[];
  appVersion: string;
  filename: string;
  onProgress?: ProgressCallback;
  signal?: AbortSignal;
}

export class ExportAbortedError extends Error {
  constructor() {
    super("Export aborted");
    this.name = "ExportAbortedError";
  }
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExportAbortedError();
}

function addFile(zip: JSZip, file: ExportFile): void {
  zip.file(file.path, file.contents);
}

/**
 * Drains the given exporters into a zip file and triggers a browser download.
 * Progress fires once per emitted file, after an initial count() pre-pass.
 */
export async function buildAndDownloadBundle(params: BundleParams): Promise<void> {
  const {
    exporters,
    source,
    categories,
    appVersion,
    filename,
    onProgress,
    signal,
  } = params;

  throwIfAborted(signal);

  // Pre-pass: total file count. +1 for the manifest.
  const counts = await Promise.all(exporters.map((e) => e.count(signal)));
  const total = counts.reduce((a, b) => a + b, 0) + 1;
  let current = 0;

  const zip = new JSZip();

  const manifest = buildManifest({ source, categories, appVersion });
  addFile(zip, { path: "manifest.json", contents: manifestToJSON(manifest) });
  current += 1;
  onProgress?.({ stage: "Preparing", current, total });

  for (const exporter of exporters) {
    throwIfAborted(signal);
    for await (const file of exporter.run(signal)) {
      throwIfAborted(signal);
      addFile(zip, file);
      current += 1;
      onProgress?.({ stage: exporter.stage, current, total });
    }
  }

  throwIfAborted(signal);
  onProgress?.({ stage: "Compressing", current, total });

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  throwIfAborted(signal);
  saveAs(blob, filename);
}
