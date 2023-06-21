import { Editor as TTEditor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { Editor } from "./Editor";

const AUTOSAVE_INTERVAL_SECONDS = 30;

const CustomDocument = Document.extend({
  content: "heading block*",
});

export interface RichTextEditorProps {
  id?: string;
  content: {
    title: string;
    body: string;
  };
  onSave?: (params: {
    id?: string;
    title: string;
    content?: string;
    isBeaconRequest?: boolean;
  }) => Promise<boolean>;
  onDelete?: (id: string) => void;
}

export function RichTextEditor(props: RichTextEditorProps) {
  const { id, content, onSave, onDelete } = props;
  const { title, body } = content;

  const hasEditedRef = useRef<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const [contentWithHeading, setContentWithHeading] = useState<string>(
    `<h1>${title}</h1>${body}`
  );

  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node, pos }) => {
          if (node.type.name === "heading") {
            return "Add a title";
          }

          return "";
        },
      }),
    ],
    content: contentWithHeading,
    onUpdate: () => {
      hasEditedRef.current = true;
    },
    editable: !!onSave,
  });

  const editorRef = useRef<TTEditor | null>(null);

  const handleSave = useCallback(
    (isBeaconRequest?: boolean) => {
      if (editorRef.current && hasEditedRef.current && onSave) {
        const htmlContent = editorRef.current.getHTML();

        const titleRegex = new RegExp(/<h1>([^<]*)<\/h1>/i);
        const titleContent = htmlContent.match(titleRegex);

        const title = titleContent?.[1];
        const content = htmlContent.replace(titleRegex, "");

        if (title) {
          setSaving(true);
          hasEditedRef.current = false;
          onSave({
            id,
            title,
            content,
            isBeaconRequest,
          })
            .catch(() => {})
            .finally(() => {
              setSaving(false);
            });
        }
      }
    },
    [id, onSave]
  );

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, AUTOSAVE_INTERVAL_SECONDS * 1000);

    return () => {
      handleSave();
      clearInterval(interval);
    };
  }, [handleSave]);

  useEffect(() => {
    const onUnloadFunction = () => {
      if (hasEditedRef.current) {
        handleSave(true);

        // Delay closing because firefox does not support keep-alive
        // NOTE - this is a bad way of handling this, but I can't find a better way to check support for keep alive
        if (navigator.userAgent?.includes("Mozilla")) {
          const time = Date.now();
          while (Date.now() - time < 500) {}
        }
      }
      return true;
    };

    window.addEventListener("beforeunload", onUnloadFunction);
    return () => {
      window.removeEventListener("beforeunload", onUnloadFunction);
    };
  }, []);

  return (
    <Editor
      editor={editor}
      editable={!!onSave}
      saving={saving}
      toolbar={
        editor &&
        onSave && (
          <EditorToolbar
            editor={editor}
            deleteNote={onDelete ? () => id && onDelete(id) : undefined}
          />
        )
      }
    />
  );
}
