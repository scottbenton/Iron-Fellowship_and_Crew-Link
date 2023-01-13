import { Card } from "@mui/material";
import { useState } from "react";
import { moves } from "../../../data/moves";
import { StatsMap } from "../../../types/Character.type";
import { Move } from "../../../types/Moves.type";
import { MoveCategory } from "./MoveCategory";
import { MoveDialog } from "./MoveDialog";

export interface MovesSectionProps {
  stats: StatsMap;
  health: number;
  spirit: number;
  supply: number;
}

export function MovesSection(props: MovesSectionProps) {
  const { stats, health, spirit, supply } = props;
  const [openMove, setOpenMove] = useState<Move>();

  return (
    <Card variant={"outlined"} sx={{ height: "100%", overflow: "auto" }}>
      {moves.map((category, index) => (
        <MoveCategory
          key={index}
          category={category}
          openMove={(move) => setOpenMove(move)}
        />
      ))}
      <MoveDialog
        move={openMove}
        handleClose={() => setOpenMove(undefined)}
        stats={stats}
        health={health}
        spirit={spirit}
        supply={supply}
      />
    </Card>
  );
}
