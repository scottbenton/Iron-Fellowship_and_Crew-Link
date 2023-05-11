import { Box, Card, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { MoveCategory } from "./MoveCategory";
import { useFilterMoves } from "./useFilterMoves";
import { useLinkedDialog } from "providers/LinkedDialogProvider";

export function MovesSection() {
  const { setSearch, filteredMoves } = useFilterMoves();

  const { openDialog } = useLinkedDialog();

  return (
    <Card variant={"outlined"} sx={{ height: "100%" }}>
      <Input
        fullWidth
        startAdornment={
          <InputAdornment position={"start"}>
            <SearchIcon sx={(theme) => ({ color: theme.palette.grey[300] })} />
          </InputAdornment>
        }
        aria-label={"Filter Moves"}
        placeholder={"Filter Moves"}
        onChange={(evt) => setSearch(evt.currentTarget.value)}
        color={"secondary"}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          px: 2,
          borderBottomColor: theme.palette.primary.light,
        })}
      />

      <Box sx={{ overflow: "auto", height: "100%" }}>
        {filteredMoves.map((category, index) => (
          <MoveCategory
            key={index}
            category={category}
            openMove={(move) => {
              openDialog(move.$id);
            }}
          />
        ))}
      </Box>
    </Card>
  );
}
