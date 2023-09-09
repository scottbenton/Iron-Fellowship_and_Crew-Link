import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChangeEventHandler, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { PortraitAvatarDisplay } from "components/PortraitAvatar/PortraitAvatarDisplay";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

export interface PortraitUploaderDialogProps {
  open: boolean;
  handleClose: () => void;
  handleUpload: (
    image: File | string,
    scale: number,
    position: { x: number; y: number }
  ) => Promise<void>;
  existingPortraitFile?: File | string;
  existingPortraitSettings?: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
}

export function PortraitUploaderDialog(props: PortraitUploaderDialogProps) {
  const {
    open,
    handleClose,
    handleUpload,
    existingPortraitFile,
    existingPortraitSettings,
  } = props;
  const { error } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | string | undefined>(
    existingPortraitFile
  );

  const [scale, setScale] = useState<number>(
    existingPortraitSettings?.scale ?? 1
  );
  const [position, setPosition] = useState<{ x: number; y: number }>(
    existingPortraitSettings?.position ?? {
      x: 0.5,
      y: 0.5,
    }
  );

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const files = evt.currentTarget.files;

    if (files && files.length > 0) {
      if (files[0].size > 5 * 1024 * 1024) {
        error("File is too large.");
        evt.target.value = "";
        return;
      }
      setFile(files[0]);
    }
  };

  const onUpload = () => {
    if (file) {
      setLoading(true);
      handleUpload(file, scale, position)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
          handleClose();
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Upload Portrait
        <Box>
          <IconButton onClick={() => handleClose()} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Button variant="outlined" component="label">
          {file ? "Change Image" : "Upload Image"}
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleFileInputChange}
          />
        </Button>
        {file && (
          <Box display={"flex"} flexDirection={"column"} mt={1}>
            <AvatarEditor
              width={200}
              height={200}
              image={file}
              borderRadius={4}
              scale={scale}
              position={position}
              onPositionChange={setPosition}
            />
            <Box display={"flex"} justifyContent={"flex-end"} mt={0.5}>
              <ButtonGroup variant={"outlined"}>
                <Button
                  disabled={scale <= 1}
                  onClick={() => setScale((prevScale) => prevScale - 0.1)}
                  aria-label={"Zoom Out"}
                >
                  <ZoomOutIcon />
                </Button>
                <Button
                  disabled={scale >= 2}
                  onClick={() => setScale((prevScale) => prevScale + 0.1)}
                  aria-label={"Zoom In"}
                >
                  <ZoomInIcon />
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={"contained"}
          onClick={() => onUpload()}
          disabled={loading}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
