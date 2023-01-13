import { Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

export interface MarkdownRendererProps {
  inlineParagraph?: boolean;
  markdown: string;
}

export function MarkdownRenderer(props: MarkdownRendererProps) {
  const { inlineParagraph, markdown } = props;

  return (
    <ReactMarkdown
      children={markdown}
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
            color={(theme) => theme.palette.text.primary}
          >
            {children}
          </Typography>
        ),
      }}
    />
  );
}
