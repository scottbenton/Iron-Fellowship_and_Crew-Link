import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface RollTitleProps {
  overline?: string;
  title: string;
  isExpanded: boolean;
  actions?: ReactNode;
}

export function RollTitle(props: RollTitleProps) {
  const { isExpanded, title, overline, actions } = props;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <div>
        {overline && isExpanded && (
          <Typography
            lineHeight={1.2}
            variant={"overline"}
            component={"p"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {overline}
          </Typography>
        )}
        <Typography
          variant={isExpanded ? "h6" : "subtitle1"}
          component={"p"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          sx={{ mr: 1 }}
        >
          {title}
        </Typography>
      </div>
      {actions && isExpanded && (
        <Stack direction={"row"} spacing={1} sx={{ mr: -1 }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
}
