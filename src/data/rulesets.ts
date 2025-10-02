import { Datasworn } from "@datasworn/core";
import { getSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";

import ironswornRuleset from "@datasworn/ironsworn-classic/json/classic.json";
import ironswornDelve from "@datasworn/ironsworn-classic-delve/json/delve.json";

import starforgedRuleset from "@datasworn/starforged/json/starforged.json";
import sunderedIsles from "@datasworn/sundered-isles/json/sundered_isles.json";

const gameSystem = getSystem();

let ruleset: Datasworn.Ruleset | undefined = undefined;
(async () => {
  if (gameSystem === GAME_SYSTEMS.IRONSWORN) {
    ruleset = ironswornRuleset as Datasworn.Ruleset;
    useStore.getState().rules.setBaseRuleset(ruleset);
  } else {
    ruleset = starforgedRuleset as unknown as Datasworn.Ruleset;
    useStore.getState().rules.setBaseRuleset(ruleset);
  }
})();

const defaultExpansions: Record<string, Datasworn.Expansion> = {};
(async () => {
  if (gameSystem === GAME_SYSTEMS.IRONSWORN) {
    const delve = ironswornDelve as unknown as Datasworn.Expansion;
    defaultExpansions[delve._id] = delve;
  } else if (gameSystem === GAME_SYSTEMS.STARFORGED) {
    const si = sunderedIsles as unknown as Datasworn.Expansion;
    defaultExpansions[si._id] = si;
  }
})();

const thirdPartyExpansions: Record<string, Datasworn.Expansion> = {};
(async () => {
  if (gameSystem === GAME_SYSTEMS.STARFORGED) {
    const starsmith = await import("./starsmith.json");
    thirdPartyExpansions[starsmith._id] =
      starsmith as unknown as Datasworn.Expansion;
  }
})();

export { ruleset, defaultExpansions, thirdPartyExpansions };
