import { Box, Button, Input, InputAdornment } from "@mui/material";
import { useRoller } from "components/DieRollProvider";
import {
  oracleRollChanceNames,
  ORACLE_ROLL_CHANCE,
} from "components/DieRollProvider/DieRollContext";
import { oracles, oracleSectionMap } from "data/oracles";
import { OracleCategory } from "./OracleCategory";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { useListenToOracleSettings } from "api/user/settings/listenToOracleSettings";
import { Oracle } from "types/Oracles.type";
import { useMemo } from "react";
import { useSettingsStore } from "stores/settings.store";

export function OracleSection() {
  const { rollOracle } = useRoller();

  const settings = useSettingsStore((store) => store.oracleSettings);

  const combinedOracles = useMemo(() => {
    const pinnedOracleNames = Object.keys(
      settings?.pinnedOracleSections ?? {}
    ).filter(
      (sectionName) =>
        settings?.pinnedOracleSections &&
        settings.pinnedOracleSections[sectionName]
    );
    const pinnedOracle: Oracle | undefined =
      pinnedOracleNames.length > 0
        ? {
            name: "Pinned Oracles",
            sections: pinnedOracleNames.map(
              (sectionName) => oracleSectionMap[sectionName]
            ),
          }
        : undefined;

    return pinnedOracle ? [pinnedOracle, ...oracles] : oracles;
  }, [settings]);

  const { search, filteredOracles, setSearch } =
    useFilterOracles(combinedOracles);

  return (
    <>
      <Box display={"flex"} flexWrap={"wrap"} p={1}>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.SMALL_CHANCE)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.SMALL_CHANCE]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.UNLIKELY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.UNLIKELY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.FIFTY_FIFTY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.FIFTY_FIFTY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.LIKELY)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.LIKELY]}
        </Button>
        <Button
          sx={{ mx: 0.5, my: 0.5 }}
          variant={"outlined"}
          color={"primary"}
          onClick={() => rollOracle(ORACLE_ROLL_CHANCE.ALMOST_CERTAIN)}
        >
          {oracleRollChanceNames[ORACLE_ROLL_CHANCE.ALMOST_CERTAIN]}
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
          key={category.name}
          pinnedCategories={settings?.pinnedOracleSections}
        />
      ))}
    </>
  );
}
