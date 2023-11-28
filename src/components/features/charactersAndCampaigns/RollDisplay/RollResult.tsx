import { Box, Typography } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";

export interface RollResultProps {
  result?: string;
  markdown?: string;
  extras?: string[];
}

export function RollResult(props: RollResultProps) {
  const { result, markdown, extras } = props;

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-start"}
      justifyContent={"center"}
    >
      {result && (
        <Typography
          color={"white"}
          variant={"h5"}
          component={"p"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {result}
        </Typography>
      )}
      {markdown && (
        <MarkdownRenderer markdown={markdown} inheritColor disableLinks />
      )}
      {Array.isArray(extras) &&
        extras.map((extra) => (
          <Typography
            key={extra}
            color={(theme) => theme.palette.grey[200]}
            variant={"caption"}
            component={"p"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {extra}
          </Typography>
        ))}
    </Box>
  );
}
