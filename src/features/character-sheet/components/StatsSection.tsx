import { Box, Stack } from "@mui/material";
import { StatsMap } from "../../../types/Character.type";

import { STATS } from "../../../types/stats.enum";
import { useCharacterSheetStore } from "../characterSheet.store";
import { StatComponent } from "./StatComponent";

export function StatsSection() {
  // We know character is defined at this point, hence the typecasting
  const stats = useCharacterSheetStore(
    (store) => store.character?.stats
  ) as StatsMap;
  const health = useCharacterSheetStore(
    (store) => store.character?.health
  ) as number;
  const spirit = useCharacterSheetStore(
    (store) => store.character?.spirit
  ) as number;
  const supply = useCharacterSheetStore((store) => store.supply) as number;

  return (
    <Box display={"flex"} flexWrap={"wrap"} justifyContent={"flex-start"}>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} p={0.5}>
        <StatComponent
          label={"Edge"}
          value={stats[STATS.EDGE]}
          sx={{ mt: 1, mr: 1 }}
        />
        <StatComponent
          label={"Heart"}
          value={stats[STATS.HEART]}
          sx={{ mt: 1, mr: 1 }}
        />
        <StatComponent
          label={"Iron"}
          value={stats[STATS.IRON]}
          sx={{ mt: 1, mr: 1 }}
        />
        <StatComponent
          label={"Shadow"}
          value={stats[STATS.SHADOW]}
          sx={{ mt: 1, mr: 1 }}
        />
        <StatComponent
          label={"Wits"}
          value={stats[STATS.WITS]}
          sx={{ mt: 1, mr: 4 }}
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} p={0.5}>
        <StatComponent label={"Health"} value={health} sx={{ mt: 1, mr: 1 }} />
        <StatComponent label={"Spirit"} value={spirit} sx={{ mt: 1, mr: 1 }} />
        <StatComponent label={"Supply"} value={supply} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}
