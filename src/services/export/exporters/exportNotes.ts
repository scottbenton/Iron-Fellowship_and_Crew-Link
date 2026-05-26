import {
  getAllNotesWithContent,
  NoteWithContent,
} from "api-calls/notes/getAllNotesWithContent";
import { Exporter, ExportFile } from "services/export/types";
import { ExportAbortedError } from "services/export/zipBundle";
import { yjsUpdateToMarkdown } from "services/export/yjsToMarkdown";

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

/**
 * Convert a note title to a URL/filename-safe ASCII kebab-case slug.
 * Falls back to the noteId if the result would be empty.
 */
export function slugify(title: string, noteId: string): string {
  const ascii = title
    .toLowerCase()
    // Replace runs of non-ASCII or non-(a-z0-9) chars with a hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // Collapse leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  return ascii.length > 0 ? ascii : noteId;
}

/**
 * Zero-pad the order number to 3 digits.
 */
export function padOrder(order: number): string {
  return String(order).padStart(3, "0");
}

// ---------------------------------------------------------------------------
// Frontmatter builder
// ---------------------------------------------------------------------------

/**
 * Escape a string for use inside YAML double-quoted scalars.
 * Only `"` and `\` need escaping; newlines become `\n`.
 */
export function escapeYamlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildFrontmatter(
  title: string,
  shared: boolean,
  order: number,
  noteId: string,
  source: "campaign" | "character"
): string {
  return [
    "---",
    `title: "${escapeYamlString(title)}"`,
    `shared: ${shared}`,
    `order: ${order}`,
    `noteId: ${noteId}`,
    `source: ${source}`,
    "---",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Path builder
// ---------------------------------------------------------------------------

function buildPath(
  prefix: string,
  order: number,
  title: string,
  noteId: string
): string {
  const paddedOrder = padOrder(order);
  const slug = slugify(title, noteId);
  return `${prefix}${paddedOrder}-${slug}.md`;
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

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

export function createNotesExporter(params: {
  campaignId?: string;
  characterId?: string;
  includeUnsharedCampaignNotes: boolean;
}): Exporter {
  const { campaignId, characterId, includeUnsharedCampaignNotes } = params;

  // Determine directory structure: dual-source → namespaced subdirs.
  const hasBoth = !!campaignId && !!characterId;
  const campaignPrefix = hasBoth ? "notes/campaign/" : "notes/";
  const characterPrefix = hasBoth ? "notes/character/" : "notes/";

  // Cached notes fetched during count().
  let cachedNotes: EnrichedNote[] | null = null;

  async function fetchAll(): Promise<EnrichedNote[]> {
    if (cachedNotes !== null) {
      return cachedNotes;
    }

    const fetches: Promise<EnrichedNote[]>[] = [];

    if (campaignId) {
      fetches.push(
        getAllNotesWithContent({
          source: "campaign",
          ownerId: campaignId,
          onlyShared: !includeUnsharedCampaignNotes,
        }).then((notes) =>
          notes.map((n) => ({
            source: "campaign" as const,
            prefix: campaignPrefix,
            ...n,
          }))
        )
      );
    }

    if (characterId) {
      fetches.push(
        getAllNotesWithContent({
          source: "character",
          ownerId: characterId,
          // Character notes are always private to the owner — no shared filter.
          onlyShared: false,
        }).then((notes) =>
          notes.map((n) => ({
            source: "character" as const,
            prefix: characterPrefix,
            ...n,
          }))
        )
      );
    }

    const groups = await Promise.all(fetches);
    cachedNotes = groups.flat();
    return cachedNotes;
  }

  return {
    stage: "Notes",

    async count(): Promise<number> {
      const notes = await fetchAll();
      return notes.length;
    },

    async *run(signal?: AbortSignal): AsyncIterable<ExportFile> {
      const notes = await fetchAll();

      for (const note of notes) {
        if (signal?.aborted) {
          throw new ExportAbortedError();
        }

        const { meta, content, noteId, source, prefix } = note;
        const title = meta.title ?? "";
        const shared = meta.shared ?? false;
        const order = meta.order ?? 0;

        const path = buildPath(prefix, order, title, noteId);
        const frontmatter = buildFrontmatter(title, shared, order, noteId, source);
        const body = yjsUpdateToMarkdown(content);

        yield {
          path,
          contents: frontmatter + body,
        };
      }
    },
  };
}
