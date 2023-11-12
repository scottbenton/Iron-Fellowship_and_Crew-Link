import { Box, Input, InputAdornment, Typography } from "@mui/material";
import { OracleCategory } from "./OracleCategory";
import SearchIcon from "@mui/icons-material/Search";
import { useFilterOracles } from "./useFilterOracles";
import { useStore } from "stores/store";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { AskTheOracleButtons } from "./AskTheOracleButtons";

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
  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);
  const { search, filteredOracles, setSearch } = useFilterOracles();

  return (
    <>
      <Box
        color={(theme) => theme.palette.darkGrey.contrastText}
        bgcolor={(theme) => theme.palette.darkGrey.dark}
        borderBottom={(theme) => `1px solid ${theme.palette.darkGrey.dark}`}
      >
        <Typography
          variant={"body2"}
          component={"div"}
          textAlign={"center"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          Ask the Oracle
        </Typography>
        <AskTheOracleButtons />
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
