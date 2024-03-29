import {
  Box,
  ButtonBase,
  Dialog,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import RemoveImageIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "providers/SnackbarProvider";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";

export interface RoundedImageUploaderProps {
  src?: string;
  title: string;
  handleFileUpload: (file: File) => void;
  handleUploadClick: () => void;
  removeImage: () => Promise<void>;
}

const RoundedImageUploaderComponent = (
  props: RoundedImageUploaderProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { src, title, handleFileUpload, handleUploadClick, removeImage } =
    props;

  const { error } = useSnackbar();

  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    const file = files?.[0];
    if (file) {
      if (files[0].size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        evt.target.value = "";
        return;
      }
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
            (src && isHovering) || theme.palette.mode === "dark"
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
          color: src
            ? theme.palette.common.white
            : theme.palette.mode === "light"
            ? theme.palette.grey[500]
            : theme.palette.grey[300],
          backgroundBlendMode: src && isHovering ? "overlay" : "initial",

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
        <img src={src} alt="NPC image" />
      </Dialog>
    </>
  );
};

export const RoundedImageUploader = forwardRef<
  HTMLInputElement,
  RoundedImageUploaderProps
>(RoundedImageUploaderComponent);
