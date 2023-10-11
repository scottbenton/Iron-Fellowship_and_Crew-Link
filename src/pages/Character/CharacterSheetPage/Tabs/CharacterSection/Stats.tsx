import { Box } from "@mui/material";
import { CustomStats } from "components/features/charactersAndCampaigns/CustomStats";
import { SectionHeading } from "components/shared/SectionHeading";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";
import { Stat } from "types/stats.enum";

export function Stats() {
  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateCharacterStat = (stat: Stat, value: number) => {
    return updateCharacter({ [`stats.${stat}`]: value });
  };

  if (!stats) {
    return null;
  }
  return (
    <>
      <SectionHeading label={"Stats"} />
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
          updateTrack={(newValue) => updateCharacterStat(Stat.Heart, newValue)}
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
          updateTrack={(newValue) => updateCharacterStat(Stat.Shadow, newValue)}
          sx={{ mr: 2, mt: 2 }}
        />
        <StatComponent
          label="Wits"
          value={stats[Stat.Wits]}
          updateTrack={(newValue) => updateCharacterStat(Stat.Wits, newValue)}
          sx={{ mr: 2, mt: 2 }}
        />
      </Box>
      <CustomStats isOnCharacterSheet />
    </>
  );
}
