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
} from "@mui/material";
import { useCharacterSheetUpdateBonds } from "api/characters/updateBonds";
import { useUpdateCharacterStat } from "api/characters/updateCharacterStat";
import { useCharacterSheetUpdateDebility } from "api/characters/updateDebility";
import { useCharacterSheetUpdateName } from "api/characters/updateName";
import { ProgressTrack } from "../../../components/ProgressTrack";
import { SectionHeading } from "../../../components/SectionHeading";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { DEBILITIES } from "../../../types/debilities.enum";
import { Stat } from "types/stats.enum";
import { useCharacterSheetStore } from "../characterSheet.store";
import { ExperienceTrack } from "./ExperienceTrack";
import { StatComponent } from "../../../components/StatComponent";
import { useCharacterSheetUpdateShareNotesWithGMSetting } from "api/characters/updateShareNotesWithGMSetting";
import { useState } from "react";
import { PortraitUploaderDialog } from "components/PortraitUploaderDialog";
import { useCharacterSheetUpdateCharacterPortrait } from "api/characters/updateCharacterPortrait";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { useCharacterSheetShowOrHideCustomMove } from "api/characters/settings/showOrHideCustomMove copy";
import { useCharacterSheetShowOrHideCustomOracle } from "api/characters/settings/showOrHideCustomOracle";

export function CharacterSection() {
  const { error } = useSnackbar();

  const campaignId = useCharacterSheetStore((store) => store.campaignId);

  const bondValue = useCharacterSheetStore(
    (store) => store.character?.bonds ?? 0
  );
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const { updateBonds } = useCharacterSheetUpdateBonds();

  const stats = useCharacterSheetStore((store) => store.character?.stats);
  const { updateCharacterStat } = useUpdateCharacterStat();

  const name = useCharacterSheetStore((store) => store.character?.name);
  const { updateName } = useCharacterSheetUpdateName();

  const debilities =
    useCharacterSheetStore((store) => store.character?.debilities) ?? {};
  const { updateDebility } = useCharacterSheetUpdateDebility();

  const handleStatChange = (stat: Stat, value: number) => {
    return updateCharacterStat({ characterId, stat, value });
  };

  const handleDebilityChange = (debility: DEBILITIES, checked: boolean) => {
    updateDebility({ debility, active: checked });
  };

  const sharingNotes = useCharacterSheetStore(
    (store) => store.character?.shareNotesWithGM
  );
  const { updateShareNotesWithGMSetting } =
    useCharacterSheetUpdateShareNotesWithGMSetting();

  const existingPortrait = useCharacterSheetStore(
    (store) => store.character?.portraitUrl
  );
  const existingPortraitSettings = useCharacterSheetStore(
    (store) => store.character?.profileImage
  );
  const [portraitDialogOpen, setPortraitDialogOpen] = useState<boolean>(false);
  const { updateCharacterPortrait } =
    useCharacterSheetUpdateCharacterPortrait();

  const customMoves = useCharacterSheetStore((store) => store.customMoves);
  const hiddenMoveIds = useCharacterSheetStore(
    (store) => store.characterSettings?.hiddenCustomMoveIds
  );
  const { showOrHideCustomMove } = useCharacterSheetShowOrHideCustomMove();

  const customOracles = useCharacterSheetStore((store) => store.customOracles);
  const hiddenOracleIds = useCharacterSheetStore(
    (store) => store.characterSettings?.hiddenCustomOraclesIds
  );
  const { showOrHideCustomOracle } = useCharacterSheetShowOrHideCustomOracle();
  return (
    <Stack spacing={2} pb={2}>
      <SectionHeading label={"Experience"} />
      <Box px={2}>
        <ExperienceTrack />
      </Box>
      <SectionHeading label={"Bonds"} />
      <Box px={2}>
        <ProgressTrack
          value={bondValue}
          max={40}
          onValueChange={(value) => updateBonds(value)}
        />
      </Box>

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
                      handleDebilityChange(DEBILITIES.WOUNDED, checked)
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
                      handleDebilityChange(DEBILITIES.SHAKEN, checked)
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
                      handleDebilityChange(DEBILITIES.UNPREPARED, checked)
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
                      handleDebilityChange(DEBILITIES.ENCUMBERED, checked)
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
                      handleDebilityChange(DEBILITIES.MAIMED, checked)
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
                      handleDebilityChange(DEBILITIES.CORRUPTED, checked)
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
                      handleDebilityChange(DEBILITIES.CURSED, checked)
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
                      handleDebilityChange(DEBILITIES.TORMENTED, checked)
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
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => handleStatChange(Stat.Edge, newValue),
            }}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Heart"
            value={stats[Stat.Heart]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(Stat.Heart, newValue),
            }}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Iron"
            value={stats[Stat.Iron]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => handleStatChange(Stat.Iron, newValue),
            }}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Shadow"
            value={stats[Stat.Shadow]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(Stat.Shadow, newValue),
            }}
            sx={{ mr: 2, mt: 2 }}
          />
          <StatComponent
            label="Wits"
            value={stats[Stat.Wits]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => handleStatChange(Stat.Wits, newValue),
            }}
            sx={{ mr: 2, mt: 2 }}
          />
        </Box>
      )}
      <Box px={2}>
        <Button
          variant={"outlined"}
          onClick={() => setPortraitDialogOpen(true)}
        >
          Upload Character Portrait
        </Button>
        <PortraitUploaderDialog
          open={portraitDialogOpen}
          handleClose={() => setPortraitDialogOpen(false)}
          handleUpload={(image, scale, position) => {
            return updateCharacterPortrait({
              portrait: typeof image === "string" ? undefined : image,
              scale,
              position,
            });
          }}
          existingPortraitFile={existingPortrait}
          existingPortraitSettings={existingPortraitSettings}
        />
      </Box>
      {campaignId && (
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
      )}
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
    </Stack>
  );
}
