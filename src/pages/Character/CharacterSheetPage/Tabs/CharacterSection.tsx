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

export function CharacterSection() {
  const uid = useStore((store) => store.auth.uid);
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const { success } = useSnackbar();

  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateCharacterStat = (stat: Stat, value: number) => {
    return updateCharacter({ [`stats.${stat}`]: value });
  };

  const name = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name
  );
  const updateName = (newName: string) => {
    return updateCharacter({ name: newName }).catch(() => {});
  };

  const debilities = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
  );

  const updateDebility = (debility: DEBILITIES, active: boolean) => {
    updateCharacter({ [`debilities.${debility}`]: active }).catch(() => {});
  };

  const sharingNotes = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.shareNotesWithGM
  );
  const updateShareNotesWithGMSetting = (shouldShare: boolean) => {
    return updateCharacter({ shareNotesWithGM: shouldShare });
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

  return (
    <Stack spacing={2} pb={2}>
      <SectionHeading label={"Debilities"} />
      <Box px={2}>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Conditions</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.WOUNDED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.WOUNDED, checked)
                    }
                    name="wounded"
                  />
                }
                label="Wounded"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.SHAKEN] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.SHAKEN, checked)
                    }
                    name="shaken"
                  />
                }
                label="Shaken"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.UNPREPARED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.UNPREPARED, checked)
                    }
                    name="unprepared"
                  />
                }
                label="Unprepared"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.ENCUMBERED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.ENCUMBERED, checked)
                    }
                    name="encumbered"
                  />
                }
                label="Encumbered"
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Banes</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.MAIMED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.MAIMED, checked)
                    }
                    name="maimed"
                  />
                }
                label="Maimed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.CORRUPTED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.CORRUPTED, checked)
                    }
                    name="corrupted"
                  />
                }
                label="Corrupted"
              />
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Burdens</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.CURSED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.CURSED, checked)
                    }
                    name="cursed"
                  />
                }
                label="Cursed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={debilities[DEBILITIES.TORMENTED] ?? false}
                    onChange={(evt, checked) =>
                      updateDebility(DEBILITIES.TORMENTED, checked)
                    }
                    name="tormented"
                  />
                }
                label="Tormented"
              />
            </FormGroup>
          </FormControl>
        </Box>
      </Box>

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
      {stats && (
        <Box
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          px={2}
          sx={{
            mt: "0px !important",
          }}
        >
          <StatComponent
            label="Edge"
            value={stats[Stat.Edge]}
            updateTrack={(newValue) => updateCharacterStat(Stat.Edge, newValue)}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Heart"
            value={stats[Stat.Heart]}
            updateTrack={(newValue) =>
              updateCharacterStat(Stat.Heart, newValue)
            }
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Iron"
            value={stats[Stat.Iron]}
            updateTrack={(newValue) => updateCharacterStat(Stat.Iron, newValue)}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Shadow"
            value={stats[Stat.Shadow]}
            updateTrack={(newValue) =>
              updateCharacterStat(Stat.Shadow, newValue)
            }
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Wits"
            value={stats[Stat.Wits]}
            updateTrack={(newValue) => updateCharacterStat(Stat.Wits, newValue)}
            sx={{ mr: 2, mt: 2 }}
          />
        </Box>
      )}
      <Box
        px={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
      >
        <Button
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

      {/* {campaignId && (
        <Box px={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sharingNotes ?? false}
                onChange={(evt, checked) =>
                  updateShareNotesWithGMSetting(checked).catch(() => {})
                }
                name="Share Notes with GM"
              />
            }
            label="Share notes with your GM?"
          />
        </Box>
      )} */}
      {!campaignId && (
        <CustomMovesSection
          customMoves={customMoves}
          hiddenMoveIds={hiddenMoveIds}
          showOrHideCustomMove={showOrHideCustomMove}
        />
      )}
      {!campaignId && (
        <CustomOracleSection
          customOracles={customOracles}
          hiddenOracleIds={hiddenOracleIds}
          showOrHideCustomOracle={showOrHideCustomOracle}
        />
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
