import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Fade } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorToolbar } from "./EditorToolbar";

const AUTOSAVE_INTERVAL_SECONDS = 30;

export interface RichTextEditorNoTitleProps {
  id?: string;
  content: string;
  onSave?: (params: {
    id?: string;
    content: string;
    isBeaconRequest?: boolean;
  }) => Promise<boolean>;
  onDelete?: (id: string) => void;
}

export function RichTextEditorNoTitle(props: RichTextEditorNoTitleProps) {
  const { id, content, onSave, onDelete } = props;

  const hasEditedRef = useRef<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: () => {
      hasEditedRef.current = true;
    },
    editable: !!onSave,
  });

  const editorRef = useRef<Editor | null>(null);

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

  return (
    <Box
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      sx={(theme) => ({
        borderWidth: onSave ? 1 : 0,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
      })}
    >
      {editor && onSave && (
        <EditorToolbar
          editor={editor}
          deleteNote={onDelete ? () => id && onDelete(id) : undefined}
        />
      )}
      <Box position={"relative"}>
        <Fade in={saving}>
          <Box
            position={"absolute"}
            top={(theme) => theme.spacing(1)}
            right={(theme) => theme.spacing(1)}
            bgcolor={(theme) => theme.palette.grey[600]}
            color={"white"}
            borderRadius={(theme) => theme.shape.borderRadius}
            px={0.5}
          >
            Saving...
          </Box>
        </Fade>
      </Box>
      <Box
        p={onSave ? 2 : 0}
        flexGrow={1}
        sx={(theme) => ({
          overflowY: "auto",
          ">div": {
            height: "100%",
            overflowX: "hidden",
            minHeight: onSave ? "300px" : 0,
            display: "flex",
            flexDirection: "column",
          },
          ".ProseMirror": {
            height: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            wordBreak: "break-word",
            maxWidth: "100%",
            flexGrow: 1,

            "&>*": {
              maxWidth: "100%",
              width: "65ch",
            },

            "&:focus": {
              outline: "none",
            },
            "&.is-empty::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: theme.palette.grey[400],
              pointerEvents: "none",
              height: 0,
            },
            "&.ProseMirror>:first-of-type": {
              marginTop: 0,
            },
          },
          blockquote: {
            borderLeft: `3px solid ${theme.palette.divider}`,
            paddingLeft: 0.5,
            marginX: 2,
          },
          hr: {
            color: theme.palette.divider,
          },
        })}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
