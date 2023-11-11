import {
  Box,
  Button,
  ButtonGroup,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { OracleCategory } from "./OracleCategory";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { useStore } from "stores/store";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { AskTheOracleIconButtons } from "./AskTheOracleIconButtons";

type oracleKeys =
  | "almostCertain"
  | "likely"
  | "fiftyFifty"
  | "unlikely"
  | "smallChance";

const askTheOracleOracles: GameSystemChooser<{ [key in oracleKeys]: string }> =
  {
    [GAME_SYSTEMS.IRONSWORN]: {
      almostCertain: "ironsworn/oracles/moves/ask_the_oracle/almost_certain",
      likely: "ironsworn/oracles/moves/ask_the_oracle/likely",
      fiftyFifty: "ironsworn/oracles/moves/ask_the_oracle/50_50",
      unlikely: "ironsworn/oracles/moves/ask_the_oracle/unlikely",
      smallChance: "ironsworn/oracles/moves/ask_the_oracle/small_chance",
    },
    [GAME_SYSTEMS.STARFORGED]: {
      almostCertain: "starforged/oracles/moves/ask_the_oracle/almost_certain",
      likely: "starforged/oracles/moves/ask_the_oracle/likely",
      fiftyFifty: "starforged/oracles/moves/ask_the_oracle/fifty-fifty",
      unlikely: "starforged/oracles/moves/ask_the_oracle/unlikely",
      smallChance: "starforged/oracles/moves/ask_the_oracle/small_chance",
    },
  };

export function OracleSection() {
  const { rollOracleTable } = useRoller();

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);
  const { search, filteredOracles, setSearch } = useFilterOracles();

  const askTheOracle = useGameSystemValue(askTheOracleOracles);

  return (
    <>
      {/* <Box display={"flex"} flexDirection={"column"} p={1}>
        <Typography variant={"subtitle2"} component={"span"}>
          Ask the Oracle
        </Typography>
        <ButtonGroup
          size={"small"}
          color={"inherit"}
          variant={"outlined"}
          aria-label={"Ask the Oracle"}
        >
          <Button
            onClick={() =>
              rollOracleTable(askTheOracle.smallChance, true, true)
            }
          >
            10%
          </Button>
          <Button
            onClick={() => rollOracleTable(askTheOracle.unlikely, true, true)}
          >
            25%
          </Button>
          <Button
            onClick={() => rollOracleTable(askTheOracle.fiftyFifty, true, true)}
          >
            50%
          </Button>
          <Button
            onClick={() => rollOracleTable(askTheOracle.likely, true, true)}
          >
            75%
          </Button>
          <Button
            onClick={() =>
              rollOracleTable(askTheOracle.almostCertain, true, true)
            }
          >
            90%
          </Button>
        </ButtonGroup>
        <AskTheOracleIconButtons />
      </Box> */}

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
      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
        {filteredOracles.map((category, index) => (
          <OracleCategory
            category={category}
            key={index}
            pinnedCategories={pinnedOracles}
          />
        ))}
      </Box>
    </>
  );
}
