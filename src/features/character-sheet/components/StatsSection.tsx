import { Box, Stack } from "@mui/material";
import { StatsMap } from "../../../types/Character.type";
import { STATS } from "../../../types/stats.enum";
import { StatComponent } from "./StatComponent";

export interface StatsSectionProps {
  characterId: string;
  stats: StatsMap;
  health: number;
  spirit: number;
  supply: number;
}

export function StatsSection(props: StatsSectionProps) {
  const { stats, characterId, health, spirit, supply } = props;

  return (
    <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
      <Stack spacing={1} direction={"row"} flexWrap={"wrap"} p={0.5}>
        <StatComponent label={"Edge"} value={stats[STATS.EDGE]} />
        <StatComponent label={"Heart"} value={stats[STATS.HEART]} />
        <StatComponent label={"Iron"} value={stats[STATS.IRON]} />
        <StatComponent label={"Shadow"} value={stats[STATS.SHADOW]} />
      </Stack>
      <Stack spacing={1} direction={"row"} flexWrap={"wrap"} p={0.5}>
        <StatComponent label={"Wits"} value={stats[STATS.WITS]} />
        <StatComponent label={"Health"} value={health} />
        <StatComponent label={"Spirit"} value={spirit} />
        <StatComponent label={"Supply"} value={supply} />
      </Stack>
    </Box>
  );
}
