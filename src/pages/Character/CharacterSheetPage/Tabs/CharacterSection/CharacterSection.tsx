import {
  Stack,
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { DEBILITIES } from "types/debilities.enum";
import { Stat } from "types/stats.enum";
import { StatComponent } from "components/StatComponent";
import { useState } from "react";
import { PortraitUploaderDialog } from "components/PortraitUploaderDialog";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { constructCharacterCardUrl } from "pages/Character/routes";
import { useStore } from "stores/store";
import { useConfirm } from "material-ui-confirm";
import { Debilities } from "./Debilities";
import { Stats } from "./Stats";

export function CharacterSection() {
  const uid = useStore((store) => store.auth.uid);
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const { success } = useSnackbar();

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const name = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name
  );
  const updateName = (newName: string) => {
    return updateCharacter({ name: newName }).catch(() => {});
  };

  const existingPortraitSettings = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.profileImage
  );
  const [portraitDialogOpen, setPortraitDialogOpen] = useState<boolean>(false);

  const updateCharacterPortrait = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacterPortrait
  );

  const customMoves = useStore(
    (store) => store.customMovesAndOracles.customMoves[store.auth.uid]
  );
  const hiddenMoveIds = useStore(
    (store) => store.customMovesAndOracles?.hiddenCustomMoveIds
  );
  const showOrHideCustomMove = useStore(
    (store) => store.customMovesAndOracles.toggleCustomMoveVisibility
  );

  const customOracles = useStore(
    (store) => store.customMovesAndOracles.customOracles[store.auth.uid]
  );
  const hiddenOracleIds = useStore(
    (store) => store.customMovesAndOracles?.hiddenCustomOracleIds
  );
  const showOrHideCustomOracle = useStore(
    (store) => store.customMovesAndOracles.toggleCustomOracleVisibility
  );

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(
        window.location.origin + constructCharacterCardUrl(characterId ?? "")
      )
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );
  const deleteCharacter = useStore((store) => store.characters.deleteCharacter);

  const confirm = useConfirm();

  const handleDeleteCharacter = (characterId: string) => {
    confirm({
      title: "Delete Character",
      description: `Are you sure you want to delete ${characterName}?`,
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

  const shouldShowDelveMoves = useStore(
    (store) => store.customMovesAndOracles.delve.showDelveMoves
  );
  const shouldShowDelveOracles = useStore(
    (store) => store.customMovesAndOracles.delve.showDelveOracles
  );
  const updateSettings = useStore(
    (store) => store.customMovesAndOracles.updateSettings
  );

  return (
    <Stack spacing={2} pb={2}>
      <Debilities />
      <SectionHeading label={"Stats & Settings"} />
      {name && (
        <Box pt={2} px={2}>
          <TextField
            label={"Name"}
            defaultValue={name}
            onBlur={(evt) => updateName(evt.target.value)}
          />
        </Box>
      )}
      <Stats />
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
            updateCharacterPortrait(
              typeof image === "string" ? undefined : image,
              scale,
              position
            ).catch(() => {})
          }
          existingPortraitSettings={existingPortraitSettings}
        />
        <Button
          sx={{ mt: 2 }}
          color={"error"}
          onClick={() => handleDeleteCharacter(characterId ?? "")}
        >
          Delete Character
        </Button>
      </Box>
      {!campaignId && (
        <>
          <CustomMovesSection
            customMoves={customMoves}
            hiddenMoveIds={hiddenMoveIds}
            showOrHideCustomMove={showOrHideCustomMove}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldShowDelveMoves}
                onChange={(evt, value) => {
                  updateSettings({ hideDelveMoves: !value }).catch(() => {});
                }}
              />
            }
            label={"Show Delve Moves?"}
            sx={{ px: 2 }}
          />
        </>
      )}
      {!campaignId && (
        <>
          <CustomOracleSection
            customOracles={customOracles}
            hiddenOracleIds={hiddenOracleIds}
            showOrHideCustomOracle={showOrHideCustomOracle}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldShowDelveOracles}
                onChange={(evt, value) => {
                  updateSettings({ hideDelveOracles: !value }).catch(() => {});
                }}
              />
            }
            label={"Show Delve Oracles?"}
            sx={{ px: 2 }}
          />
        </>
      )}
      <SectionHeading label={"Misc"} />
      <Box px={2}>
        <Alert severity="info">
          <div>
            Iron Fellowship includes an overlay for OBS or other webcam editors
            so you can overlay information about your character as you play. You
            can add the given link as a browser source over your camera to
            display this information.
          </div>
          <Button
            onClick={() => copyLinkToClipboard()}
            color={"inherit"}
            variant={"outlined"}
            sx={{ mt: 1 }}
          >
            Copy link to Card Overlay for OBS
          </Button>
        </Alert>
      </Box>
    </Stack>
  );
}
