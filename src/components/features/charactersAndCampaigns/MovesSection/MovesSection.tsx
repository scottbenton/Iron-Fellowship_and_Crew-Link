import { Box, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { MoveCategory } from "./MoveCategory";
import { useFilterMoves } from "./useFilterMoves";
import { useStore } from "stores/store";
import { EmptyState } from "components/shared/EmptyState";

export function MovesSection() {
  const {
    moveCategories,
    setSearch,
    visibleMoveCategoryIds,
    visibleMoveIds,
    isSearchActive,
    isEmpty,
  } = useFilterMoves();

  const openDialog = useStore((store) => store.appState.openDialog);

  return (
    <>
      <Box
        color={(theme) => theme.palette.darkGrey.contrastText}
        bgcolor={(theme) => theme.palette.darkGrey.dark}
        borderBottom={(theme) => `1px solid ${theme.palette.darkGrey.dark}`}
      >
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
          onChange={(evt) => setSearch(evt.currentTarget.value)}
          color={"primary"}
          sx={(theme) => ({
            backgroundColor: theme.palette.darkGrey.main,
            color: "#fff",
            px: 2,
            borderBottomColor: theme.palette.darkGrey.light,
          })}
        />
      </Box>
      <Box
        sx={{
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        {!isEmpty ? (
          moveCategories.map((category, index) => (
            <MoveCategory
              key={index}
              category={category}
              openMove={(move) => {
                openDialog(move.$id);
              }}
              forceOpen={isSearchActive}
              visibleCategories={visibleMoveCategoryIds}
              visibleMoves={visibleMoveIds}
            />
          ))
        ) : (
          <EmptyState message={"No Moves Found"} sx={{ pb: 2 }} />
        )}
      </Box>
    </>
  );
}
