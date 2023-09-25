import { Box, Button, Input, InputAdornment } from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { OracleCategory } from "./OracleCategory";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { useStore } from "stores/store";

export function OracleSection() {
  const { rollOracleTable } = useRoller();

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);
  const { search, filteredOracles, setSearch } = useFilterOracles();

  return (
    <>
      <Box display={"flex"} flexWrap={"wrap"} p={1}>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"inherit"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/small_chance",
              true,
              true
            )
          }
        >
          Small Chance
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"inherit"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/unlikely",
              true,
              true
            )
          }
        >
          Unlikely
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"inherit"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/50_50",
              true,
              true
            )
          }
        >
          50/50
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"inherit"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/likely",
              true,
              true
            )
          }
        >
          Likely
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"inherit"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/almost_certain",
              true,
              true
            )
          }
        >
          Almost Certain
        </Button>
      </Box>

      <Input
        fullWidth
        startAdornment={
          <InputAdornment position={"start"}>
            <SearchIcon sx={(theme) => ({ color: theme.palette.grey[300] })} />
          </InputAdornment>
        }
        aria-label={"Filter Oracles"}
        placeholder={"Filter Oracles"}
        value={search}
        onChange={(evt) => setSearch(evt.target.value)}
        color={"primary"}
        sx={(theme) => ({
          backgroundColor: theme.palette.darkGrey.main,
          color: "#fff",
          px: 2,
          borderBottomColor: theme.palette.darkGrey.light,
        })}
      />
      {filteredOracles.map((category) => (
        <OracleCategory
          category={category}
          key={category.Title.Standard}
          pinnedCategories={pinnedOracles}
        />
      ))}
    </>
  );
}
