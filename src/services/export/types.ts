export interface ExportFile {
  path: string;
  contents: string | Uint8Array;
}

export interface ExportProgress {
  stage: string;
  current: number;
  total: number;
}

export type ProgressCallback = (progress: ExportProgress) => void;

export interface Exporter {
  /**
   * Cheap pre-pass: returns the number of files this exporter will emit.
   * Used to compute an accurate progress bar before streaming begins.
   * May make a small number of metadata reads.
   */
  count(signal?: AbortSignal): Promise<number>;

  /**
   * Streams export files. Each yielded file is one progress tick.
   */
  run(signal?: AbortSignal): AsyncIterable<ExportFile>;

  /**
   * Human-readable stage label for the progress UI.
   */
  readonly stage: string;
}
