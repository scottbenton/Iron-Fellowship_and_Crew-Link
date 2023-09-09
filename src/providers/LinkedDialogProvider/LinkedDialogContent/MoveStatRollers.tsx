import { Box } from "@mui/material";
import { StatComponent } from "components/StatComponent";
import { Stat, PlayerConditionMeter } from "types/stats.enum";
import { MoveStats } from "../../../components/MovesSection/MoveStats.type";
import { useStore } from "stores/store";

export interface MoveStatsProps {
  stats?: MoveStats;
  visibleStats: { [key: string]: boolean };
}

export function MoveStatRollers(props: MoveStatsProps) {
  const { stats, visibleStats } = props;

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateCurrentCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  if (!stats) return null;

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {visibleStats[Stat.Edge] && (
        <StatComponent
          label={"Edge"}
          value={stats[Stat.Edge]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[Stat.Heart] && (
        <StatComponent
          label={"Heart"}
          value={stats[Stat.Heart]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[Stat.Iron] && (
        <StatComponent
          label={"Iron"}
          value={stats[Stat.Iron]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[Stat.Shadow] && (
        <StatComponent
          label={"Shadow"}
          value={stats[Stat.Shadow]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[Stat.Wits] && (
        <StatComponent
          label={"Wits"}
          value={stats[Stat.Wits]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[PlayerConditionMeter.Health] && (
        <StatComponent
          label={"Health"}
          value={stats[PlayerConditionMeter.Health]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[PlayerConditionMeter.Spirit] && (
        <StatComponent
          label={"Spirit"}
          value={stats[PlayerConditionMeter.Spirit]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats[PlayerConditionMeter.Supply] && (
        <StatComponent
          label={"Supply"}
          value={stats[PlayerConditionMeter.Supply]}
          sx={{ mb: 1, mr: 1 }}
        />
      )}
      {visibleStats["companion health"] &&
        stats.companionHealth.map((companion, index) => (
          <StatComponent
            key={index}
            label={`${companion.companionName}'s Health`}
            value={companion.health}
            sx={{ mb: 1, mr: 1 }}
          />
        ))}

      {Object.keys(visibleStats).length > 0 && (
        <StatComponent
          label={`Adds`}
          value={adds ?? 0}
          updateTrack={(newValue) =>
            updateCurrentCharacter({ adds: newValue }).catch(() => {})
          }
          sx={{ mb: 1, mr: 1 }}
        />
      )}
    </Box>
  );
}
