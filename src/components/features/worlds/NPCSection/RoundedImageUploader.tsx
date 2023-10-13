import {
  Box,
  ButtonBase,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, forwardRef, useRef, useState } from "react";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

export interface RoundedImageUploaderProps {
  src?: string;
  title: string;
  handleFileUpload: (file: File) => void;
  handleUploadClick: () => void;
}

export const RoundedImageUploader = forwardRef<
  HTMLInputElement,
  RoundedImageUploaderProps
>((props, ref) => {
  const { src, title, handleFileUpload, handleUploadClick } = props;

  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

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
        component={ButtonBase}
        sx={(theme) => ({
          backgroundImage: `url("${src}")`,
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          color: src
            ? theme.palette.common.white
            : theme.palette.mode === "light"
            ? theme.palette.grey[500]
            : theme.palette.grey[300],

          borderRadius: "50%",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          border: `4px solid ${theme.palette.background.paper}`,
          width: isLg ? 150 : 100,
          height: isLg ? 150 : 100,
          position: "relative",
          flexShrink: 0,
          top: theme.spacing(isLg ? -8 : -4),
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",

          "&:focus-visible": {
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[400]
                : theme.palette.grey[800],
          },
          "&>.MuiTouchRipple-root": {
            borderRadius: "50%",
          },
        })}
        onClick={() => (!src ? handleUploadClick() : setIsFullScreen(true))}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!src && <AddPhotoIcon />}
        {src && isHovering && <FullscreenIcon color={"inherit"} />}
      </Box>
      <input
        type="file"
        accept={"image/*"}
        hidden
        ref={ref}
        onChange={onFileUpload}
      />
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
});
