import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { yDocToProsemirrorJSON } from "y-prosemirror";
import * as Y from "yjs";

const FRAGMENT_FIELD = "default";

/**
 * Convert a Yjs update payload (as stored in Firestore note/world docs) to
 * markdown. Returns an empty string for empty/missing docs.
 *
 * Runs the conversion through a detached tiptap Editor configured with the
 * same nodes/marks the app's editors use, then asks tiptap-markdown to
 * serialize. Each call constructs and destroys its own Editor so callers
 * don't share state.
 */
export function yjsUpdateToMarkdown(update: Uint8Array | undefined | null): string {
  if (!update || update.length === 0) {
    return "";
  }

  const yDoc = new Y.Doc();
  try {
    Y.applyUpdate(yDoc, update);
  } catch (err) {
    console.error("yjsUpdateToMarkdown: failed to apply Y.Doc update", err);
    return "";
  }

  let pmJson: unknown;
  try {
    pmJson = yDocToProsemirrorJSON(yDoc, FRAGMENT_FIELD);
  } catch (err) {
    console.error("yjsUpdateToMarkdown: failed to convert Y.Doc to PM JSON", err);
    yDoc.destroy();
    return "";
  }

  const editor = new Editor({
    extensions: [
      StarterKit.configure({ history: false }),
      Link,
      Markdown.configure({ html: false, tightLists: true }),
    ],
    content: pmJson as never,
  });

  try {
    const markdown = editor.storage.markdown.getMarkdown();
    return typeof markdown === "string" ? markdown.trim() : "";
  } finally {
    editor.destroy();
    yDoc.destroy();
  }
}
