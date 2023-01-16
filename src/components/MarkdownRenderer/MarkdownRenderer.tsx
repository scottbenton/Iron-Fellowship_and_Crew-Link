import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownRendererProps {
  inlineParagraph?: boolean;
  markdown: string;
}

export function MarkdownRenderer(props: MarkdownRendererProps) {
  const { inlineParagraph, markdown } = props;

  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <Typography
            variant={"body2"}
            display={inlineParagraph ? "inline" : "block"}
            color={(theme) =>
              inlineParagraph
                ? theme.palette.text.secondary
                : theme.palette.text.primary
            }
            py={inlineParagraph ? 0 : 1}
          >
            {children}
          </Typography>
        ),
        li: ({ children }) => (
          <Typography
            component={"li"}
            variant={"body2"}
            color={(theme) =>
              inlineParagraph
                ? theme.palette.text.secondary
                : theme.palette.text.primary
            }
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <Box component={"ul"} pl={1.5}>
            {children}
          </Box>
        ),
        table: ({ children }) => (
          <Box
            component={"table"}
            mt={1}
            border={1}
            borderColor={(theme) => theme.palette.divider}
            borderRadius={(theme) => theme.shape.borderRadius}
            sx={{ borderCollapse: "collapse" }}
          >
            {children}
          </Box>
        ),
        thead: ({ children }) => (
          <Box component={"thead"} bgcolor={(theme) => theme.palette.grey[200]}>
            {children}
          </Box>
        ),
        th: ({ children }) => (
          <Typography
            component={"th"}
            variant={"body2"}
            textAlign={"left"}
            p={1}
          >
            <b>{children}</b>
          </Typography>
        ),
        tr: ({ children }) => (
          <Box
            component={"tr"}
            sx={(theme) => ({
              "&:nth-of-type(even)": {
                backgroundColor: theme.palette.grey[100],
              },
            })}
          >
            {children}
          </Box>
        ),
        td: ({ children }) => (
          <Typography
            component={"td"}
            px={1}
            py={0.5}
            variant={"body2"}
            color={(theme) => theme.palette.grey[700]}
          >
            {children}
          </Typography>
        ),
      }}
    />
  );
}
