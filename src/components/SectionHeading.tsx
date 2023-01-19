import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface SectionHeadingProps {
  label: string;
  action?: ReactNode;
}

export function SectionHeading(props: SectionHeadingProps) {
  const { label, action } = props;

  return (
    <Box
      bgcolor={(theme) => theme.palette.grey[200]}
      px={2}
      py={0.5}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Typography
        variant={"h6"}
        fontFamily={(theme) => theme.fontFamilyTitle}
        color={(theme) => theme.palette.text.secondary}
      >
        {label}
      </Typography>
      {action}
    </Box>
  );
}
