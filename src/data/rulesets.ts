import { Datasworn } from "@datasworn/core";
import { getSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";

const gameSystem = getSystem();

let ruleset: Datasworn.Ruleset | undefined = undefined;
(async () => {
  if (gameSystem === GAME_SYSTEMS.IRONSWORN) {
    ruleset = JSON.parse(
      JSON.stringify(
        await import("@datasworn/ironsworn-classic/json/classic.json")
      )
    ) as Datasworn.Ruleset;
    useStore.getState().rules.setBaseRuleset(ruleset);
  } else {
    ruleset = JSON.parse(
      JSON.stringify(await import("@datasworn/starforged/json/starforged.json"))
    ) as Datasworn.Ruleset;
    useStore.getState().rules.setBaseRuleset(ruleset);
  }
})();

const defaultExpansions: Record<string, Datasworn.Expansion> = {};
(async () => {
  if (gameSystem === GAME_SYSTEMS.IRONSWORN) {
    const delve = JSON.parse(
      JSON.stringify(
        (await import("@datasworn/ironsworn-classic-delve/json/delve.json"))
          .default
      )
    ) as unknown as Datasworn.Expansion;
    defaultExpansions[delve._id] = delve;
  } else if (gameSystem === GAME_SYSTEMS.STARFORGED) {
    const starsmith = JSON.parse(
      JSON.stringify((await import("./thirdparty/starsmith.json")).default)
    ) as unknown as Datasworn.Expansion;
    defaultExpansions[starsmith._id] = starsmith;
  }
})();

export { ruleset, defaultExpansions };
