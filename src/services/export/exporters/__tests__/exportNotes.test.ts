import { beforeEach, describe, it, expect, vi } from "vitest";
import { collectAsyncIterable } from "../../__tests__/testUtils";

const mocks = vi.hoisted(() => ({
  getAllNotesWithContent: vi.fn(),
  yjsUpdateToMarkdown: vi.fn(),
}));

// Mock Firestore and Firebase deps before importing the exporter module,
// since the notes API calls import firebase.config which requires `location`
// (a browser global unavailable in the Node test environment).
vi.mock("config/firebase.config", () => ({
  firestore: {},
}));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));
vi.mock("api-calls/notes/getAllNotesWithContent", () => ({
  getAllNotesWithContent: mocks.getAllNotesWithContent,
}));
vi.mock("services/export/yjsToMarkdown", () => ({
  yjsUpdateToMarkdown: mocks.yjsUpdateToMarkdown,
}));

import { NotesExporter, slugify } from "../exportNotes";

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

describe("slugify", () => {
  it("converts ASCII lowercase title to kebab-case", () => {
    expect(slugify("Hello World", "id-1")).toBe("hello-world");
  });

  it("strips non-ASCII (emoji / accented) and falls back to noteId", () => {
    // A title that is only emoji → becomes empty after stripping → noteId
    expect(slugify("🎉🔥", "note-abc")).toBe("note-abc");
  });

  it("handles mixed ASCII and non-ASCII — keeps only ASCII slug parts", () => {
    expect(slugify("café notes", "id-2")).toBe("cafe-notes");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello---world", "id-3")).toBe("hello-world");
  });

  it("strips leading/trailing hyphens", () => {
    expect(slugify("--hello--", "id-4")).toBe("hello");
  });

  it("returns noteId when title is empty string", () => {
    expect(slugify("", "fallback-id")).toBe("fallback-id");
  });

  it("returns noteId when title is whitespace only", () => {
    expect(slugify("   ", "fallback-id")).toBe("fallback-id");
  });
});

describe("NotesExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.yjsUpdateToMarkdown.mockImplementation(
      (content: Uint8Array | null) => (content ? `markdown-${content[0]}` : "")
    );
  });

  it("exports notes as name-based JSON files and reuses the count fetch", async () => {
    mocks.getAllNotesWithContent.mockResolvedValue([
      {
        noteId: "n-2",
        meta: { title: "Alpha", order: 2, shared: true },
        content: new Uint8Array([2]),
      },
      {
        noteId: "n-1",
        meta: { title: "Alpha", order: 1 },
        content: new Uint8Array([1]),
      },
    ]);

    const exporter = new NotesExporter({
      characterId: "character-1",
      includeUnsharedCampaignNotes: false,
    });

    await expect(exporter.count()).resolves.toBe(2);
    const files = await collectAsyncIterable(exporter.run());

    expect(mocks.getAllNotesWithContent).toHaveBeenCalledTimes(1);
    expect(files.map((file) => file.path)).toEqual([
      "notes/alpha.json",
      "notes/alpha-2.json",
    ]);
    expect(JSON.parse(String(files[0].contents))).toEqual({
      noteId: "n-1",
      title: "Alpha",
      shared: false,
      order: 1,
      source: "character",
      markdown: "markdown-1",
    });
  });
});
