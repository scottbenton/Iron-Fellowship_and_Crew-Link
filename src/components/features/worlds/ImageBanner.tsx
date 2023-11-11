import { Box, ButtonBase, Dialog, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import RemoveImageIcon from "@mui/icons-material/Delete";

export interface ImageBannerProps {
  src?: string;
  title: string;
  removeImage: () => Promise<void>;
}

export function ImageBanner(props: ImageBannerProps) {
  const { src, title, removeImage } = props;

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
        <DialogTitleWithCloseButton
          onClose={() => setIsFullScreen(false)}
          actions={
            <Tooltip title={"Remove Image"}>
              <IconButton
                onClick={() => {
                  removeImage()
                    .then(() => {
                      setIsFullScreen(false);
                    })
                    .catch(() => {});
                }}
              >
                <RemoveImageIcon />
              </IconButton>
            </Tooltip>
          }
        >
          {title}
        </DialogTitleWithCloseButton>
        <img src={src} alt="Location image" />
      </Dialog>
    </>
  );
}
