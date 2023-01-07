import { Box, Typography } from "@mui/material";

export interface EmptyStateProps {
  imageSrc: string;
  title: string;
  message: string;
  callToAction?: React.ReactNode;
}

export function EmptyState(props: EmptyStateProps) {
  const { imageSrc, title, message, callToAction } = props;
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} mt={8}>
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
      <Typography variant={"h4"} mt={2}>
        {title}
      </Typography>
      <Typography variant={"body1"} color={"GrayText"}>
        {message}
      </Typography>
      {callToAction && <Box mt={2}>{callToAction}</Box>}
    </Box>
  );
}
