import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";
import { useSnackbar } from "providers/SnackbarProvider";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useStore } from "stores/store";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AvatarEditor from "react-avatar-editor";

export interface ChangeNamePortraitDialogOpenProps {
  open: boolean;
  onClose: () => void;
}

export function ChangeNamePortraitDialog(
  props: ChangeNamePortraitDialogOpenProps
) {
  const { open, onClose } = props;

  const { error } = useSnackbar();

  const initialName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );
  const initialPortraitSettings = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.profileImage
  );

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId ?? ""
  );

  const initialFileUrl = useStore(
    (store) => store.characters.characterPortraitMap[characterId]?.url
  );

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(initialName);

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );
  const updatePortrait = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacterPortrait
  );
  const removePortrait = useStore(
    (store) => store.characters.currentCharacter.removeCurrentCharacterPortrait
  );
  const [file, setFile] = useState<File | string | undefined>(initialFileUrl);
  const [scale, setScale] = useState<number>(
    initialPortraitSettings?.scale ?? 1
  );
  const [position, setPosition] = useState<{ x: number; y: number }>(
    initialPortraitSettings?.position ?? {
      x: 0.5,
      y: 0.5,
    }
  );

  useEffect(() => {
    setFile((prevFile) =>
      !prevFile || typeof prevFile === "string" ? initialFileUrl : prevFile
    );
  }, [initialFileUrl]);

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    handleClearFile();
    const files = evt.currentTarget.files;

    if (files && files.length > 0) {
      if (files[0].size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        evt.target.value = "";
        return;
      }
      setFile(files[0]);
    }
  };
  const handleClearFile = () => {
    setFile(undefined);
    setPosition({ x: 0.5, y: 0.5 });
    setScale(1);
  };

  const handleSave = () => {
    setIsLoading(true);

    const promises: Promise<unknown>[] = [];
    if (name !== initialName) {
      promises.push(updateCharacter({ name }));
    }
    if (
      file &&
      (scale !== initialPortraitSettings?.scale ||
        position !== initialPortraitSettings?.position)
    ) {
      if (file !== initialFileUrl && typeof file !== "string") {
        promises.push(updatePortrait(file, scale, position));
      } else {
        promises.push(
          updateCharacter({
            "profileImage.position": position,
            "profileImage.scale": scale,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
        );
      }
    } else if (!file && initialFileUrl) {
      promises.push(removePortrait());
    }

    Promise.all(promises)
      .then(() => {
        onClose();
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        Change Character Name and Portrait
      </DialogTitleWithCloseButton>
      <DialogContent>
        <TextField
          sx={{ mt: 1 }}
          label={"Name"}
          value={name}
          onChange={(evt) => setName(evt.currentTarget.value)}
        />
        <Box mt={2}>
          <Button variant='outlined' component='label' color={"inherit"}>
            {file ? "Change Image" : "Upload Image"}
            <input
              hidden
              accept='image/*'
              multiple
              type='file'
              onChange={handleFileInputChange}
            />
          </Button>
          {file && (
            <Button
              variant={"outlined"}
              color={"error"}
              sx={{ ml: 1 }}
              onClick={handleClearFile}
            >
              Remove Image
            </Button>
          )}
          {file && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              mt={1}
            >
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
                    color={"inherit"}
                    disabled={scale <= 1}
                    onClick={() => setScale((prevScale) => prevScale - 0.1)}
                    aria-label={"Zoom Out"}
                  >
                    <ZoomOutIcon />
                  </Button>
                  <Button
                    color={"inherit"}
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={"contained"} onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
