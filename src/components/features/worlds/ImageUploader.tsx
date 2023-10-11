import { Box, ButtonBase, Dialog, IconButton, Typography } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

export interface ImageUploaderProps {
  src?: string;
  title: string;
  handleFileUpload: (file: File) => void;
  handleClose: () => void;
}

export function ImageUploader(props: ImageUploaderProps) {
  const { src, title, handleFileUpload, handleClose } = props;

  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    const file = files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <>
      <Box
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        component={src ? "div" : ButtonBase}
        sx={(theme) => ({
          aspectRatio: "16/9",
          maxHeight: 300,
          maxWidth: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundImage: `url("${src}")`,
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          color:
            theme.palette.mode === "light"
              ? theme.palette.grey[500]
              : theme.palette.grey[300],
          backgroundSize: "cover",
          backgroundPosition: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        })}
        onClick={() => !src && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept={"image/*"}
          hidden
          ref={fileInputRef}
          onChange={onFileUpload}
        />
        {src && (
          <Box
            position={"absolute"}
            top={0}
            right={0}
            p={1}
            bgcolor={(theme) => theme.palette.background.paper}
            sx={(theme) => ({
              borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            {isHovering && (
              <IconButton onClick={() => fileInputRef.current?.click()}>
                <AddPhotoIcon />
              </IconButton>
            )}
            {isHovering && (
              <IconButton onClick={() => setIsFullScreen(true)}>
                <FullscreenIcon />
              </IconButton>
            )}
            <IconButton onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        {!src && (
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <AddPhotoIcon
              sx={(theme) => ({
                width: 36,
                height: 36,
                mb: 1,
              })}
            />
            <Typography color={"textSecondary"}>
              Click to upload an Image
            </Typography>
          </Box>
        )}
      </Box>
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
