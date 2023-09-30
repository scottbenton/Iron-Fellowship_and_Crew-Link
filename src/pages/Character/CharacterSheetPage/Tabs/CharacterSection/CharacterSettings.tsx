import { Box, Button, TextField } from "@mui/material";
import { PortraitUploaderDialog } from "components/features/characters/PortraitUploaderDialog";
import { SectionHeading } from "components/shared/SectionHeading";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useStore } from "stores/store";

export function CharacterSettings() {
  const confirm = useConfirm();

  const [portraitDialogOpen, setPortraitDialogOpen] = useState(false);

  const name = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const portraitSettings = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.profileImage
  );
  const updatePortrait = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacterPortrait
  );

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const deleteCharacter = useStore((store) => store.characters.deleteCharacter);
  const handleDeleteCharacter = (characterId: string) => {
    confirm({
      title: "Delete Character",
      description: `Are you sure you want to delete ${name}?`,
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteCharacter(characterId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      <SectionHeading label={"Character Settings"} />

      <Box pt={2} px={2}>
        <TextField
          label={"Name"}
          defaultValue={name}
          onBlur={(evt) =>
            updateCharacter({ name: evt.target.value }).catch(() => {})
          }
        />
      </Box>
      <Box
        px={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
      >
        <Button
          color={"inherit"}
          variant={"outlined"}
          onClick={() => setPortraitDialogOpen(true)}
        >
          Upload Character Portrait
        </Button>
        <PortraitUploaderDialog
          open={portraitDialogOpen}
          handleClose={() => setPortraitDialogOpen(false)}
          handleUpload={(image, scale, position) =>
            updatePortrait(
              typeof image === "string" ? undefined : image,
              scale,
              position
            ).catch(() => {})
          }
          existingPortraitSettings={portraitSettings}
        />
        <Button
          sx={{ mt: 2 }}
          color={"error"}
          onClick={() => handleDeleteCharacter(characterId ?? "")}
        >
          Delete Character
        </Button>
      </Box>
    </>
  );
}
