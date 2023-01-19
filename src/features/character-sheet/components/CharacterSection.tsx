import { Stack, Box, Grid, TextField } from "@mui/material";
import { ProgressTrack } from "../../../components/ProgressTrack";
import { SectionHeading } from "../../../components/SectionHeading";
import { STATS } from "../../../types/stats.enum";
import { useCharacterSheetStore } from "../characterSheet.store";
import { ExperienceTrack } from "./ExperienceTrack";
import { StatComponent } from "./StatComponent";

export function CharacterSection() {
  const bondValue = useCharacterSheetStore(
    (store) => store.character?.bonds ?? 0
  );
  const updateBonds = useCharacterSheetStore((store) => store.updateBonds);

  const stats = useCharacterSheetStore((store) => store.character?.stats);
  const updateStat = useCharacterSheetStore((store) => store.updateStat);

  const name = useCharacterSheetStore((store) => store.character?.name);
  const updateName = useCharacterSheetStore((store) => store.updateName);

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
      <SectionHeading label={"Stats & Settings"} />
      {name && (
        <Box px={2}>
          <TextField
            label={"Name"}
            defaultValue={name}
            onBlur={(evt) => updateName(evt.target.value)}
          />
        </Box>
      )}
      {stats && (
        <Stack direction={"row"} spacing={2} flexWrap={"wrap"} px={2}>
          <StatComponent
            label="Edge"
            value={stats[STATS.EDGE]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.EDGE, newValue),
            }}
          />
          <StatComponent
            label="Heart"
            value={stats[STATS.HEART]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.HEART, newValue),
            }}
          />
          <StatComponent
            label="Iron"
            value={stats[STATS.IRON]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.IRON, newValue),
            }}
          />
          <StatComponent
            label="Shadow"
            value={stats[STATS.SHADOW]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.SHADOW, newValue),
            }}
          />
          <StatComponent
            label="Wits"
            value={stats[STATS.WITS]}
            updateTrack={{
              min: 0,
              max: 5,
              handleChange: (newValue) => updateStat(STATS.WITS, newValue),
            }}
          />
        </Stack>
      )}
    </Stack>
  );
}
