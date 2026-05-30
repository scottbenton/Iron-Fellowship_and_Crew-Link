// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import * as Y from "yjs";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { prosemirrorJSONToYDoc } from "y-prosemirror";
import { yjsUpdateToMarkdown } from "../yjsToMarkdown";

function buildYDocFromMarkdown(markdown: string): Uint8Array {
  const editor = new Editor({
    extensions: [StarterKit.configure({ history: false }), Link, Markdown],
    content: markdown,
  });
  const json = editor.getJSON();
  const schema = editor.schema;
  editor.destroy();
  const yDoc = prosemirrorJSONToYDoc(schema, json, "default");
  try {
    return Y.encodeStateAsUpdate(yDoc);
  } finally {
    yDoc.destroy();
  }
}

describe("yjsUpdateToMarkdown", () => {
  it("returns empty string for missing/empty updates", () => {
    expect(yjsUpdateToMarkdown(undefined)).toBe("");
    expect(yjsUpdateToMarkdown(null)).toBe("");
    expect(yjsUpdateToMarkdown(new Uint8Array(0))).toBe("");
  });

  it("round-trips a heading and paragraph", () => {
    const update = buildYDocFromMarkdown("# Hello\n\nWorld text");
    const md = yjsUpdateToMarkdown(update);
    expect(md).toContain("# Hello");
    expect(md).toContain("World text");
  });

  it("round-trips a bullet list", () => {
    const update = buildYDocFromMarkdown("- one\n- two\n- three");
    const md = yjsUpdateToMarkdown(update);
    expect(md).toMatch(/- one/);
    expect(md).toMatch(/- two/);
    expect(md).toMatch(/- three/);
  });

  it("preserves links and bold", () => {
    const update = buildYDocFromMarkdown(
      "A **bold** word and a [link](https://example.com)."
    );
    const md = yjsUpdateToMarkdown(update);
    expect(md).toContain("**bold**");
    expect(md).toContain("[link](https://example.com)");
  });

  it("does not crash on corrupted updates", () => {
    const bad = new Uint8Array([0xff, 0x00, 0x42]);
    expect(yjsUpdateToMarkdown(bad)).toBe("");
  });
});
