import { Box } from "@mui/material";
import { MarkdownRenderer, MarkdownRendererProps } from "./MarkdownRenderer";

export interface ClampedMarkdownRendererProps extends MarkdownRendererProps {
  maxLines?: number;
}

export function ClampedMarkdownRenderer(props: ClampedMarkdownRendererProps) {
  const { maxLines = 1, ...markdownRendererProps } = props;
  return (
    <Box
      component={"span"}
      sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: maxLines,
        overflow: "hidden",
      }}
    >
      <MarkdownRenderer {...markdownRendererProps} />
    </Box>
  );
}
