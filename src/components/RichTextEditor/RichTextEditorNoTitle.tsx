import { Editor as TTEditor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Fade } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { Editor } from "./Editor";

const AUTOSAVE_INTERVAL_SECONDS = 30;

export interface RichTextEditorNoTitleProps {
  id?: string;
  content: string;
  onSave?: (params: {
    id?: string;
    content: string;
    isBeaconRequest?: boolean;
  }) => Promise<boolean | void>;
  onDelete?: (id: string) => void;
}

export function RichTextEditorNoTitle(props: RichTextEditorNoTitleProps) {
  const { id, content, onSave, onDelete } = props;

  const hasEditedRef = useRef<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content,
      onUpdate: () => {
        hasEditedRef.current = true;
      },
      editable: !!onSave,
    },
    [id]
  );

  const editorRef = useRef<TTEditor | null>(null);

  const handleSave = useCallback(
    (isBeaconRequest?: boolean) => {
      if (editorRef.current && hasEditedRef.current && onSave) {
        const content = editorRef.current.getHTML();
        if (content) {
          setSaving(true);
          hasEditedRef.current = false;
          onSave({
            id,
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

  useEffect(() => {
    if (
      editor &&
      (!editor.getHTML() || editor.getHTML() === "<p></p>") &&
      content
    ) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <Editor
      editor={editor}
      toolbar={
        editor &&
        onSave && (
          <EditorToolbar
            editor={editor}
            deleteNote={onDelete ? () => id && onDelete(id) : undefined}
          />
        )
      }
      editable={!!onSave}
      saving={saving}
      outlined
    />
  );
}
