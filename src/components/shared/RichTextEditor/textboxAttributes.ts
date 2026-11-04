/**
 * For useEditor's editorProps.attributes: makes the editable area a named,
 * multi-line textbox for screen readers. Tiptap 2.4 adds no role of its own.
 */
export function textboxAttributes(label: string): Record<string, string> {
  return {
    role: "textbox",
    "aria-multiline": "true",
    "aria-label": label,
  };
}
