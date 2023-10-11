import { Box, SxProps, Typography } from "@mui/material";

export interface EmptyStateProps {
  imageSrc?: string;
  title?: string;
  message?: string;
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
      mt={imageSrc ? 8 : 2}
      sx={sx}
    >
      {imageSrc && (
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
      )}
      <Box
        maxWidth={"48ch"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        {title && (
          <Typography variant={"h4"} mt={2} textAlign={"center"}>
            {title}
          </Typography>
        )}
        {message && (
          <Typography
            variant={"body1"}
            color={"textSecondary"}
            textAlign={"center"}
          >
            {message}
          </Typography>
        )}
        {callToAction && <Box mt={2}>{callToAction}</Box>}
      </Box>
    </Box>
  );
}
