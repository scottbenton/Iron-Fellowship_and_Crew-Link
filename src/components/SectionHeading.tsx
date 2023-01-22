import { Box, SxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface SectionHeadingProps {
  label: string;
  action?: ReactNode;
  breakContainer?: boolean;
  sx?: SxProps;
}

export function SectionHeading(props: SectionHeadingProps) {
  const { label, action, breakContainer, sx } = props;

  return (
    <Box
      bgcolor={(theme) => theme.palette.grey[200]}
      px={3}
      py={0.5}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      mx={breakContainer ? -3 : 0}
      sx={sx}
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
