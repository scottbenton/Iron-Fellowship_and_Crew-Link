import {
  Stack,
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
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
  const updateBonds = useCharacterSheetStore((store) => store.updateBonds);

  const stats = useCharacterSheetStore((store) => store.character?.stats);
  const updateStat = useCharacterSheetStore((store) => store.updateStat);

  const name = useCharacterSheetStore((store) => store.character?.name);
  const updateName = useCharacterSheetStore((store) => store.updateName);

  const debilities =
    useCharacterSheetStore((store) => store.character?.debilities) ?? {};
  const updateDebility = useCharacterSheetStore(
    (store) => store.updateDebility
  );

  const handleDebilityChange = (debility: DEBILITIES, checked: boolean) => {
    updateDebility(debility, checked).catch((e) => {
      error("Failed to update debility");
    });
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
                    checked={debilities[DEBILITIES.WOUNDED]}
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
                    checked={debilities[DEBILITIES.SHAKEN]}
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
                    checked={debilities[DEBILITIES.UNPREPARED]}
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
                    checked={debilities[DEBILITIES.ENCUMBERED]}
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
                    checked={debilities[DEBILITIES.MAIMED]}
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
                    checked={debilities[DEBILITIES.CORRUPTED]}
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
                    checked={debilities[DEBILITIES.CURSED]}
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
                    checked={debilities[DEBILITIES.TORMENTED]}
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
              handleChange: (newValue) => updateStat(STATS.EDGE, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Heart"
            value={stats[STATS.HEART]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.HEART, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Iron"
            value={stats[STATS.IRON]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.IRON, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Shadow"
            value={stats[STATS.SHADOW]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.SHADOW, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
          <StatComponent
            label="Wits"
            value={stats[STATS.WITS]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.WITS, newValue),
            }}
            sx={{ mr: 2, mb: 2 }}
          />
        </Box>
      )}
    </Stack>
  );
}
