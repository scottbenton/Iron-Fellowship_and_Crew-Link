import { Box } from "@mui/material";
import { StatComponent } from "components/StatComponent";
import { PlayerConditionMeter } from "types/stats.enum";
import { useStore } from "stores/store";
import { MoveStatRoller } from "./MoveStatRoller";

export interface MoveStatsProps {
  visibleStats: { [key: string]: boolean };
}

export function MoveStatRollers(props: MoveStatsProps) {
  const { visibleStats } = props;

  const stats = useStore((store) => {
    const currentCharacter = store.characters.currentCharacter.currentCharacter;

    if (currentCharacter) {
      const statMap = { ...currentCharacter.stats };
      store.settings.customStats.forEach((customStat) => {
        if (!statMap[customStat]) {
          statMap[customStat] = 0;
        }
      });
      store.settings.customTracks.forEach((customTrack) => {
        if (!statMap[customTrack.label] && customTrack.rollable) {
          const index = (currentCharacter.customTracks ?? {})[
            customTrack.label
          ];
          const value =
            index && typeof customTrack.values[index].value === "number"
              ? customTrack.values[index].value
              : 0;
          statMap[customTrack.label] = value as number;
        }
      });
      statMap[PlayerConditionMeter.Health] = currentCharacter.health;
      statMap[PlayerConditionMeter.Spirit] = currentCharacter.spirit;
      statMap[PlayerConditionMeter.Supply] =
        store.campaigns.currentCampaign.currentCampaign?.supply ??
        currentCharacter.supply;

      return statMap;
    }
    return undefined;
  });

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateCurrentCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {Object.keys(visibleStats).map(
        (visibleStat) =>
          visibleStats[visibleStat] && (
            <MoveStatRoller
              key={visibleStat}
              stats={stats ?? {}}
              statName={visibleStat}
            />
          )
      )}

      {stats &&
        Object.keys(visibleStats).filter(
          (statKey) => statKey !== "vow progress"
        ).length > 0 && (
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
