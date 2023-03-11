import { Box } from "@mui/material";
import { StatsMap } from "../../../types/Character.type";

import { Stat } from "types/stats.enum";
import { useCharacterSheetStore } from "../characterSheet.store";
import { StatComponent } from "../../../components/StatComponent";

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
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} pl={0.5}>
        <StatComponent
          label={"Edge"}
          value={stats[Stat.Edge]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Heart"}
          value={stats[Stat.Heart]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Iron"}
          value={stats[Stat.Iron]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Shadow"}
          value={stats[Stat.Shadow]}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Wits"}
          value={stats[Stat.Wits]}
          sx={{ my: 0.5, mr: 4 }}
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} pl={0.5}>
        <StatComponent
          label={"Health"}
          value={health}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent
          label={"Spirit"}
          value={spirit}
          sx={{ my: 0.5, mr: 1 }}
        />
        <StatComponent label={"Supply"} value={supply} sx={{ my: 0.5 }} />
      </Box>
    </Box>
  );
}
