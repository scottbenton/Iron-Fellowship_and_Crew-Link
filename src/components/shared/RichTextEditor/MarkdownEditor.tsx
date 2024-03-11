import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Editor } from "./Editor";
import { Box, Typography } from "@mui/material";
import { MarkdownEditorToolbar } from "./MarkdownEditorToolbar";
import Link from "@tiptap/extension-link";

export interface MarkdownEditorProps {
  label: string;
  content: string;
  onChange: (markdown: string) => void;
  onBlur: () => void;
}

export function MarkdownEditor(props: MarkdownEditorProps) {
  const { label, content, onChange, onBlur } = props;

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Markdown,
        Link.extend({ inclusive: false }).configure({ openOnClick: false }),
      ],
      content,
      onBlur,
      onUpdate: ({ editor }) => {
        const markdown = editor.storage.markdown.getMarkdown();
        onChange(markdown);
      },
    },
    []
  );

  return (
    <Editor
      toolbar={
        <>
          <Box
            display={"flex"}
            position={"relative"}
            sx={(theme) => ({
              top: theme.spacing(-1.5),
              left: theme.spacing(1),
            })}
          >
            <Typography
              component={"span"}
              variant={"caption"}
              color={"text.secondary"}
              sx={{
                px: 1,
                bgcolor: "background.paper",
              }}
            >
              {label}
            </Typography>
          </Box>
          <MarkdownEditorToolbar editor={editor} />
        </>
      }
      editor={editor}
      editable
      outlined
      minHeight={100}
    />
  );
}
