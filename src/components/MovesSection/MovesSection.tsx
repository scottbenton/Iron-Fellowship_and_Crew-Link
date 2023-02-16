import { Card, Input, InputAdornment } from "@mui/material";
import { useState } from "react";
import { StatsMap } from "../../types/Character.type";
import { Move } from "../../types/Moves.type";
import useFilterMoves from "./useFilterMoves";
import { MoveCategory } from "./MoveCategory";
import { MoveDialog } from "./MoveDialog";
import SearchIcon from "@mui/icons-material/Search";

export interface MovesSectionProps {
  stats?: {
    health: number;
    spirit: number;
    supply: number;
  } & StatsMap;
}

export function MovesSection(props: MovesSectionProps) {
  const { stats } = props;

  const [openMove, setOpenMove] = useState<Move>();

  const { setSearch, filteredMoves } = useFilterMoves();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <Card variant={"outlined"} sx={{ height: "100%", overflow: "auto" }}>
        <Input
          fullWidth
          startAdornment={
            <InputAdornment position={"start"}>
              <SearchIcon
                sx={(theme) => ({ color: theme.palette.grey[300] })}
              />
            </InputAdornment>
          }
          aria-label={"Filter Moves"}
          placeholder={"Filter Moves"}
          onChange={handleSearch}
          color={"secondary"}
          sx={(theme) => ({
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            px: 2,
            borderBottomColor: theme.palette.primary.light,
          })}
        />

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
        />
      </Card>
    </>
  );
}
