import { Box, ButtonBase, Dialog, IconButton, Typography } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

export interface ImageBannerProps {
  src?: string;
  title: string;
}

export function ImageBanner(props: ImageBannerProps) {
  const { src, title } = props;

  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <>
      {src && (
        <Box
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          component={ButtonBase}
          sx={(theme) => ({
            aspectRatio: "16/9",
            maxHeight: 300,
            maxWidth: "100%",
            width: "100%",
            overflow: "hidden",
            backgroundImage: `url("${src}")`,
            backgroundColor: theme.palette.grey[700],

            color: theme.palette.common.white,
            backgroundSize: "cover",
            backgroundBlendMode: isHovering ? "overlay" : "initial",
            backgroundPosition: "center center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "& #fullscreen-icon": {
              display: "none",
            },
            "&:hover #fullscreen-icon": {
              display: "block",
            },
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
          onClick={() => setIsFullScreen(true)}
        >
          <FullscreenIcon id={"fullscreen-icon"} />
        </Box>
      )}
      <Dialog open={isFullScreen} onClose={() => setIsFullScreen(false)}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          py={0.5}
          pl={2}
          pr={1}
        >
          <Typography variant={"h6"}>{title}</Typography>
          <IconButton color={"inherit"} onClick={() => setIsFullScreen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <img src={src} alt="Location image" />
      </Dialog>
    </>
  );
}
