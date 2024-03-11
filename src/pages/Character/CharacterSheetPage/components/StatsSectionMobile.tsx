import { Box } from "@mui/material";
import { StatsMap } from "types/Character.type";

import { STATS } from "types/stats.enum";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";

const orderedStats: string[] = [
  STATS.EDGE,
  STATS.HEART,
  STATS.IRON,
  STATS.SHADOW,
  STATS.WITS,
];

export function StatsSectionMobile() {
  const showNewRules = useNewCustomContentPage();
  const ruleStats = useStore((store) => store.rules.stats);

  // We know character is defined at this point, hence the typecasting
  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  ) as StatsMap;
  const customStats = useStore((store) => store.settings.customStats);

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateAdds = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const allStats = [...orderedStats, ...customStats];

  return (
    <Box mt={1} mx={-1}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"row"}
        flexWrap={"wrap"}
        gap={0.5}
      >
        {showNewRules ? (
          <>
            {Object.keys(ruleStats).map((statKey) => (
              <StatComponent
                key={statKey}
                label={ruleStats[statKey].label}
                value={stats[statKey] ?? 0}
                sx={{ width: 54 }}
              />
            ))}
          </>
        ) : (
          <>
            {allStats.map((stat) => (
              <StatComponent
                key={stat}
                label={stat}
                value={stats[stat]}
                sx={{ width: 54 }}
              />
            ))}
          </>
        )}
        <StatComponent
          label={"Adds"}
          updateTrack={(newValue) => updateAdds({ adds: newValue })}
          value={adds}
          sx={{ width: 54 }}
        />
      </Box>
    </Box>
  );
}
