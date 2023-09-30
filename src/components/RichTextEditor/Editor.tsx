import { Box, Fade } from "@mui/material";
import { EditorContent, Editor as TTEditor } from "@tiptap/react";
import { ReactNode } from "react";

export interface EditorProps {
  outlined?: boolean;
  editable?: boolean;
  editor: TTEditor | null;
  saving?: boolean;
  toolbar?: ReactNode;
}

export function Editor(props: EditorProps) {
  const { outlined, editable, editor, toolbar, saving } = props;

  return (
    <Box
      sx={(theme) =>
        outlined
          ? {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderWidth: editable ? 1 : 0,
              borderStyle: "solid",
              borderColor: theme.palette.divider,
              borderRadius: `${theme.shape.borderRadius}px`,
              overflow: "hidden",
            }
          : {
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }
      }
    >
      {toolbar}
      <Box position={"relative"}>
        <Fade in={saving}>
          <Box
            position={"absolute"}
            top={(theme) => theme.spacing(1)}
            right={(theme) => theme.spacing(1)}
            bgcolor={(theme) => theme.palette.grey[600]}
            color={"white"}
            borderRadius={(theme) => `${theme.shape.borderRadius}px`}
            px={0.5}
          >
            Saving...
          </Box>
        </Fade>
      </Box>
      <Box
        flexGrow={1}
        sx={(theme) => ({
          overflowY: "auto",
          ">div": {
            height: "100%",
            overflowX: "hidden",
            ...(outlined
              ? {
                  minHeight: editable ? "300px" : 0,
                  display: "flex",
                  flexDirection: "column",
                }
              : {}),
          },
          ".ProseMirror": {
            height: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            wordBreak: "break-word",
            maxWidth: "100%",
            flexGrow: 1,

            p: editable || !outlined ? 2 : 0,

            "&>*": {
              maxWidth: "100%",
              width: "65ch",
            },

            "&:focus": {
              outline: "none",
            },
            "&>.is-empty::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: theme.palette.action.disabled,
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
          ".collaboration-cursor__caret": {
            borderLeft: "1px solid #0d0d0d",
            borderRight: "1px solid #0d0d0d",
            marginLeft: "-1px",
            marginRight: "-1px",
            pointerEvents: "none",
            position: "relative",
            wordBreak: "normal",
          },

          /* Render the username above the caret */
          ".collaboration-cursor__label": {
            borderRadius: `${theme.shape.borderRadius}px`,
            borderBottomLeftRadius: 0,
            color: theme.palette.text.secondary,
            ...theme.typography.caption,
            left: "-1px",
            lineHeight: "normal",
            px: 0.5,
            py: 0.25,
            position: "absolute",
            top: "-1.4em",
            userSelect: "none",
            whiteSpace: "nowrap",
          },
        })}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
