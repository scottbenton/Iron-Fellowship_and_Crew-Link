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
    <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
      <Stack spacing={1} direction={"row"} flexWrap={"wrap"} p={0.5}>
        <StatComponent label={"Edge"} value={stats[STATS.EDGE]} />
        <StatComponent label={"Heart"} value={stats[STATS.HEART]} />
        <StatComponent label={"Iron"} value={stats[STATS.IRON]} />
        <StatComponent label={"Shadow"} value={stats[STATS.SHADOW]} />
        <StatComponent label={"Wits"} value={stats[STATS.WITS]} />
      </Stack>
      <Stack spacing={1} direction={"row"} flexWrap={"wrap"} p={0.5} ml={4}>
        <StatComponent label={"Health"} value={health} />
        <StatComponent label={"Spirit"} value={spirit} />
        <StatComponent label={"Supply"} value={supply} />
      </Stack>
    </Box>
  );
}
