import { getSystem } from "hooks/useGameSystem";
import { RulesSliceData } from "./rules.slice.type";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { Datasworn } from "@datasworn/core";
import ironswornRules from "@datasworn/ironsworn-classic/json/classic.json";
import starforgedRules from "@datasworn/starforged/json/starforged.json";
import { parseOraclesIntoMaps } from "./helpers/parseOraclesIntoMaps";
import { parseMovesIntoMaps } from "./helpers/parseMovesIntoMaps";

const gameSystem = getSystem();

const gameSystemRules: GameSystemChooser<Datasworn.Ruleset> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornRules as Datasworn.Ruleset,
  [GAME_SYSTEMS.STARFORGED]: starforgedRules as Datasworn.Ruleset,
};
const gameSystemProgressTracks: GameSystemChooser<string[]> = {
  [GAME_SYSTEMS.IRONSWORN]: ["Combat", "Vow", "Journey"],
  [GAME_SYSTEMS.STARFORGED]: [
    "Combat",
    "Vow",
    "Expedition",
    "Connection",
    "Scene Challenge",
  ],
};

const defaultRuleset = gameSystemRules[gameSystem];

export const defaultRulesSlice: RulesSliceData = {
  expansionIds: [],
  baseRuleset: defaultRuleset,
  progressTracks: gameSystemProgressTracks[gameSystem],
  stats: defaultRuleset.rules.stats,
  conditionMeters: defaultRuleset.rules.condition_meters,
  specialTracks: defaultRuleset.rules.special_tracks,
  impacts: defaultRuleset.rules.impacts,
  rootOracleCollectionIds: Object.values(defaultRuleset.oracles).map(
    (oracle) => oracle.id
  ),
  oracleMaps: parseOraclesIntoMaps(defaultRuleset.oracles),
  rootMoveCollectionIds: Object.values(defaultRuleset.moves).map(
    (move) => move.id
  ),
  moveMaps: parseMovesIntoMaps(defaultRuleset.moves),
};
