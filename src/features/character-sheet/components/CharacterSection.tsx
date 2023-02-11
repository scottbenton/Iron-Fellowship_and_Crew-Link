import {
  Stack,
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCharacterSheetUpdateBonds } from "api/characters/updateBonds";
import { useUpdateCharacterStat } from "api/characters/updateCharacterStat";
import { useCharacterSheetUpdateDebility } from "api/characters/updateDebility";
import { useCharacterSheetUpdateName } from "api/characters/updateName";
import { ProgressTrack } from "../../../components/ProgressTrack";
import { SectionHeading } from "../../../components/SectionHeading";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { DEBILITIES } from "../../../types/debilities.enum";
import { STATS } from "../../../types/stats.enum";
import { useCharacterSheetStore } from "../characterSheet.store";
import { ExperienceTrack } from "./ExperienceTrack";
import { StatComponent } from "./StatComponent";

export function CharacterSection() {
  const { error } = useSnackbar();

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

  const handleStatChange = (stat: STATS, value: number) => {
    return updateCharacterStat({ characterId, stat, value });
  };

  const handleDebilityChange = (debility: DEBILITIES, checked: boolean) => {
    updateDebility({ debility, active: checked });
  };

  return (
    <Stack spacing={2}>
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
        <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} px={2}>
          <StatComponent
            label="Edge"
            value={stats[STATS.EDGE]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(STATS.EDGE, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Heart"
            value={stats[STATS.HEART]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(STATS.HEART, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Iron"
            value={stats[STATS.IRON]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(STATS.IRON, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Shadow"
            value={stats[STATS.SHADOW]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(STATS.SHADOW, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Wits"
            value={stats[STATS.WITS]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) =>
                handleStatChange(STATS.WITS, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
        </Box>
      )}
    </Stack>
  );
}
