import {
  getAllNotesWithContent,
  NoteWithContent,
} from "api-calls/notes/getAllNotesWithContent";
import { Exporter, ExportFile } from "services/export/types";
import { ExportAbortedError } from "services/export/zipBundle";
import {
  buildUniqueExportPath,
  createExportFilenameTracker,
  slugifyExportName,
} from "services/export/exportFilename";
import { yjsUpdateToMarkdown } from "services/export/yjsToMarkdown";

export function slugify(title: string, noteId: string): string {
  return slugifyExportName(title, noteId);
}

// ---------------------------------------------------------------------------
// Enriched record type used internally
// ---------------------------------------------------------------------------

interface EnrichedNote {
  source: "campaign" | "character";
  prefix: string;
  noteId: string;
  meta: NoteWithContent["meta"];
  content: Uint8Array | null;
}

export interface NotesExporterParams {
  campaignId?: string;
  characterId?: string;
  includeUnsharedCampaignNotes: boolean;
}

export class NotesExporter implements Exporter {
  readonly stage = "Notes";

  private readonly campaignId?: string;

  private readonly characterId?: string;

  private readonly includeUnsharedCampaignNotes: boolean;

  private readonly campaignPrefix: string;

  private readonly characterPrefix: string;

  private cachedNotes: EnrichedNote[] | null = null;

  constructor(params: NotesExporterParams) {
    this.campaignId = params.campaignId;
    this.characterId = params.characterId;
    this.includeUnsharedCampaignNotes = params.includeUnsharedCampaignNotes;

    const hasBoth = !!params.campaignId && !!params.characterId;
    this.campaignPrefix = hasBoth ? "notes/campaign/" : "notes/";
    this.characterPrefix = hasBoth ? "notes/character/" : "notes/";
  }

  private async fetchAll(): Promise<EnrichedNote[]> {
    if (this.cachedNotes !== null) {
      return this.cachedNotes;
    }

    const fetches: Promise<EnrichedNote[]>[] = [];

    if (this.campaignId) {
      fetches.push(
        getAllNotesWithContent({
          source: "campaign",
          ownerId: this.campaignId,
          onlyShared: !this.includeUnsharedCampaignNotes,
        }).then((notes) =>
          notes.map((n) => ({
            source: "campaign" as const,
            prefix: this.campaignPrefix,
            ...n,
          }))
        )
      );
    }

    if (this.characterId) {
      fetches.push(
        getAllNotesWithContent({
          source: "character",
          ownerId: this.characterId,
          // Character notes are always private to the owner — no shared filter.
          onlyShared: false,
        }).then((notes) =>
          notes.map((n) => ({
            source: "character" as const,
            prefix: this.characterPrefix,
            ...n,
          }))
        )
      );
    }

    const groups = await Promise.all(fetches);
    this.cachedNotes = groups.flat().sort((a, b) => {
      const sourceCompare = a.source.localeCompare(b.source);
      if (sourceCompare !== 0) return sourceCompare;
      const orderCompare = (a.meta.order ?? 0) - (b.meta.order ?? 0);
      if (orderCompare !== 0) return orderCompare;
      const titleCompare = (a.meta.title ?? "").localeCompare(b.meta.title ?? "");
      if (titleCompare !== 0) return titleCompare;
      return a.noteId.localeCompare(b.noteId);
    });
    return this.cachedNotes;
  }

  async count(): Promise<number> {
    const notes = await this.fetchAll();
    return notes.length;
  }

  async *run(signal?: AbortSignal): AsyncIterable<ExportFile> {
    const notes = await this.fetchAll();
    const paths = createExportFilenameTracker();

    for (const note of notes) {
      if (signal?.aborted) {
        throw new ExportAbortedError();
      }

      const { meta, content, noteId, source, prefix } = note;
      const title = meta.title ?? "";
      const shared = meta.shared ?? false;
      const order = meta.order ?? 0;

      yield {
        path: buildUniqueExportPath({
          directory: prefix.replace(/\/$/, ""),
          name: title,
          fallbackId: noteId,
          extension: "json",
          tracker: paths,
        }),
        contents: JSON.stringify(
          {
            id: noteId,
            noteId,
            title,
            shared,
            order,
            source,
            markdown: yjsUpdateToMarkdown(content),
          },
          null,
          2
        ),
      };
    }
  }
}
