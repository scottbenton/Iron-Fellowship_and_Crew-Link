import { Box, Card, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { MoveCategory } from "./MoveCategory";
import { useFilterMoves } from "./useFilterMoves";
import { useLinkedDialog } from "providers/LinkedDialogProvider";
import { MoveCategory as MoveCategoryType } from "dataforged";

export function MovesSection() {
  const { setSearch, filteredMoves } = useFilterMoves();

  const { openDialog } = useLinkedDialog();

  return (
    <>
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
        color={"primary"}
        sx={(theme) => ({
          backgroundColor: theme.palette.darkGrey.main,
          color: "#fff",
          px: 2,
          "&::hover": {
            borderBottomColor: theme.palette.darkGrey.light,
          },
        })}
      />

      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
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
    </>
  );
}
