import { Card, TextField } from "@mui/material";
import { useState } from "react";
import { StatsMap } from "../../../types/Character.type";
import { Move } from "../../../types/Moves.type";
import { useCharacterSheetStore } from "../characterSheet.store";
import useFilterMoves from "../hooks/useFilterMoves";
import { MoveCategory } from "./MoveCategory";
import { MoveDialog } from "./MoveDialog";

export function MovesSection() {
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

  const [openMove, setOpenMove] = useState<Move>();

  const { setSearch, filteredMoves } = useFilterMoves();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <TextField
        label={"Search moves"}
        fullWidth
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <Card variant={"outlined"} sx={{ height: "100%", overflow: "auto" }}>
        {filteredMoves.map((category, index) => (
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
    </>
  );
}
