import { describe, it, expect, vi } from "vitest";

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

import { slugify, padOrder, escapeYamlString } from "./exportNotes";

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
    // "café notes" → "caf-notes" (é stripped → hyphen collapsed)
    expect(slugify("café notes", "id-2")).toBe("caf-notes");
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

// ---------------------------------------------------------------------------
// padOrder
// ---------------------------------------------------------------------------

describe("padOrder", () => {
  it("zero-pads single digit to 3 chars", () => {
    expect(padOrder(1)).toBe("001");
  });

  it("zero-pads double digit to 3 chars", () => {
    expect(padOrder(42)).toBe("042");
  });

  it("leaves 3-digit number unchanged", () => {
    expect(padOrder(100)).toBe("100");
  });

  it("does not truncate numbers >= 1000", () => {
    expect(padOrder(1000)).toBe("1000");
  });
});

// ---------------------------------------------------------------------------
// escapeYamlString (frontmatter title escaping)
// ---------------------------------------------------------------------------

describe("escapeYamlString", () => {
  it("escapes double quotes", () => {
    expect(escapeYamlString('He said "hello"')).toBe('He said \\"hello\\"');
  });

  it("escapes newlines", () => {
    expect(escapeYamlString("line1\nline2")).toBe("line1\\nline2");
  });

  it("escapes backslashes", () => {
    expect(escapeYamlString("path\\to\\file")).toBe("path\\\\to\\\\file");
  });

  it("leaves plain ASCII unchanged", () => {
    expect(escapeYamlString("Simple title")).toBe("Simple title");
  });

  it("handles combined edge case: quote + newline", () => {
    expect(escapeYamlString('"title"\nsubtitle')).toBe('\\"title\\"\\nsubtitle');
  });
});
