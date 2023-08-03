import { Box, Button, Input, InputAdornment } from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { OracleCategory } from "./OracleCategory";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { useSettingsStore } from "stores/settings.store";
import { OracleSet } from "dataforged";

/**
 * 
 * "ironsworn/oracles/moves/ask_the_oracle/almost_certain"
​
26: "ironsworn/oracles/moves/ask_the_oracle/likely"
​
27: "ironsworn/oracles/moves/ask_the_oracle/50_50"
​
28: "ironsworn/oracles/moves/ask_the_oracle/unlikely"
​
29: "ironsworn/oracles/moves/ask_the_oracle/small_chance"
 */

export function OracleSection() {
  const { rollOracleTable } = useRoller();

  const settings = useSettingsStore((store) => store.oracleSettings);

  // const { search, filteredOracles, setSearch } = useFilterOracles();
  const search = "";
  const setSearch = (search: string) => {};
  const filteredOracles: OracleSet[] = [];

  return (
    <>
      <Box display={"flex"} flexWrap={"wrap"} p={1}>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/small_chance"
            )
          }
        >
          Small Chance
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() =>
            rollOracleTable("ironsworn/oracles/moves/ask_the_oracle/unlikely")
          }
        >
          Unlikely
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() =>
            rollOracleTable("ironsworn/oracles/moves/ask_the_oracle/50_50")
          }
        >
          50/50
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() =>
            rollOracleTable("ironsworn/oracles/moves/ask_the_oracle/likely")
          }
        >
          Likely
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() =>
            rollOracleTable(
              "ironsworn/oracles/moves/ask_the_oracle/almost_certain"
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
        color={"secondary"}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          px: 2,
          borderBottomColor: theme.palette.primary.light,
        })}
      />
      {filteredOracles.map((category) => (
        <OracleCategory
          category={category}
          key={category.Title.Standard}
          pinnedCategories={settings?.pinnedOracleSections}
        />
      ))}
    </>
  );
}
