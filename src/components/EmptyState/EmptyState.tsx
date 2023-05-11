import { Box, SxProps, Typography } from "@mui/material";

export interface EmptyStateProps {
  imageSrc: string;
  title: string;
  message: string;
  callToAction?: React.ReactNode;
  sx?: SxProps;
}

export function EmptyState(props: EmptyStateProps) {
  const { imageSrc, title, message, callToAction, sx } = props;
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      mt={8}
      sx={sx}
    >
      <Box
        width={200}
        height={200}
        sx={{
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${imageSrc})`,
        }}
      />
      <Box
        maxWidth={"48ch"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Typography variant={"h4"} mt={2} textAlign={"center"}>
          {title}
        </Typography>
        <Typography variant={"body1"} color={"GrayText"} textAlign={"center"}>
          {message}
        </Typography>
        {callToAction && <Box mt={2}>{callToAction}</Box>}
      </Box>
    </Box>
  );
}
