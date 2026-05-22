import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

export type MultiOracleConfig = {
  tables: string | string[];
  joinTables?: boolean;
};

export enum Oracles {}

export enum AskTheOracle {
  AlmostCertain = "almost_certain",
  Likely = "likely",
  FiftyFifty = "fifty_fifty",
  Unlikely = "unlikely",
  SmallChance = "small_chance",
}

interface OracleMap {
  askTheOracle: {
    [AskTheOracle.AlmostCertain]: string;
    [AskTheOracle.Likely]: string;
    [AskTheOracle.FiftyFifty]: string;
    [AskTheOracle.Unlikely]: string;
    [AskTheOracle.SmallChance]: string;
  };
}

export const sharedOracleConfig: GameSystemChooser<OracleMap> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    askTheOracle: {
      [AskTheOracle.AlmostCertain]:
        "move.oracle_rollable:classic/fate/ask_the_oracle.almost_certain",
      [AskTheOracle.Likely]:
        "move.oracle_rollable:classic/fate/ask_the_oracle.likely",
      [AskTheOracle.FiftyFifty]:
        "move.oracle_rollable:classic/fate/ask_the_oracle.fifty_fifty",
      [AskTheOracle.Unlikely]:
        "move.oracle_rollable:classic/fate/ask_the_oracle.unlikely",
      [AskTheOracle.SmallChance]:
        "move.oracle_rollable:classic/fate/ask_the_oracle.small_chance",
    },
  },
  [GAME_SYSTEMS.STARFORGED]: {
    askTheOracle: {
      [AskTheOracle.AlmostCertain]:
        "move.oracle_rollable:starforged/fate/ask_the_oracle.almost_certain",
      [AskTheOracle.Likely]:
        "move.oracle_rollable:starforged/fate/ask_the_oracle.likely",
      [AskTheOracle.FiftyFifty]:
        "move.oracle_rollable:starforged/fate/ask_the_oracle.fifty_fifty",
      [AskTheOracle.Unlikely]:
        "move.oracle_rollable:starforged/fate/ask_the_oracle.unlikely",
      [AskTheOracle.SmallChance]:
        "move.oracle_rollable:starforged/fate/ask_the_oracle.small_chance",
    },
  },
};
