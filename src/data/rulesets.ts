import { Datasworn } from "@datasworn/core";
import { getSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface IRulesetConfig {
  id: string;
  name: string;
  type: "ruleset";
  isHomebrew: false;
  load: () => Promise<Datasworn.Ruleset>;
}

export interface IExpansionConfig {
  id: string;
  name: string;
  type: "expansion";
  isHomebrew: boolean;
  licenseInfo?: {
    license: string;
    licenseUrl: string;
    url?: string;
    author: string;
  };
  load: () => Promise<Datasworn.Expansion>;
}

export type IPackageConfig = IRulesetConfig | IExpansionConfig;

// ─── Rulesets ────────────────────────────────────────────────────────────────

export const ironswornConfig: IRulesetConfig = {
  id: "classic",
  name: "Ironsworn",
  type: "ruleset",
  isHomebrew: false,
  load: async () => {
    const json = await import(
      "@datasworn/ironsworn-classic/json/classic.json"
    );
    return json as unknown as Datasworn.Ruleset;
  },
};

export const starforgedConfig: IRulesetConfig = {
  id: "starforged",
  name: "Starforged",
  type: "ruleset",
  isHomebrew: false,
  load: async () => {
    const json = await import(
      "@datasworn/starforged/json/starforged.json"
    );
    return json as unknown as Datasworn.Ruleset;
  },
};

// ─── Official Ironsworn Expansions ────────────────────────────────────────────

export const ironswornDelveConfig: IExpansionConfig = {
  id: "delve",
  name: "Ironsworn: Delve",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const json = await import(
      "@datasworn/ironsworn-classic-delve/json/delve.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

export const ironswornLodestarConfig: IExpansionConfig = {
  id: "lodestar",
  name: "Ironsworn Lodestar",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const json = await import(
      "@datasworn/ironsworn-classic-lodestar/json/lodestar.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

// ─── Official Starforged Expansions ──────────────────────────────────────────

export const sunderedIslesConfig: IExpansionConfig = {
  id: "sundered_isles",
  name: "Sundered Isles",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const json = await import(
      "@datasworn/sundered-isles/json/sundered_isles.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

// ─── Community Content ────────────────────────────────────────────────────────

export const ironsmithConfig: IExpansionConfig = {
  id: "ironsmith",
  name: "Ironsmith",
  type: "expansion",
  isHomebrew: true,
  licenseInfo: {
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    url: "https://playeveryrole.com/",
    author: "Eric Bright",
  },
  load: async () => {
    const json = await import(
      "@datasworn-community-content/ironsmith/json/ironsmith.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

export const starsmithConfig: IExpansionConfig = {
  id: "starsmith",
  name: "Starsmith Expanded Oracles",
  type: "expansion",
  isHomebrew: true,
  licenseInfo: {
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    url: "https://playeveryrole.com/",
    author: "Eric Bright",
  },
  load: async () => {
    const json = await import(
      "@datasworn-community-content/starsmith/json/starsmith.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

export const feRunnersConfig: IExpansionConfig = {
  id: "fe_runners",
  name: "Fe-Runners",
  type: "expansion",
  isHomebrew: true,
  licenseInfo: {
    license: "CC BY-NC-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    url: "https://zombiecraig.itch.io/",
    author: "Craig Smith",
  },
  load: async () => {
    const json = await import(
      "@datasworn-community-content/fe-runners/json/fe_runners.json"
    );
    return json as unknown as Datasworn.Expansion;
  },
};

// ─── Organized Collections ───────────────────────────────────────────────────

export const includedRulesets: Record<string, IRulesetConfig> = {
  [ironswornConfig.id]: ironswornConfig,
  [starforgedConfig.id]: starforgedConfig,
};

/** All expansions organized by their parent ruleset id. */
export const includedExpansions: Record<string, Record<string, IExpansionConfig>> = {
  [ironswornConfig.id]: {
    [ironswornDelveConfig.id]: ironswornDelveConfig,
    [ironswornLodestarConfig.id]: ironswornLodestarConfig,
    [ironsmithConfig.id]: ironsmithConfig,
  },
  [starforgedConfig.id]: {
    [sunderedIslesConfig.id]: sunderedIslesConfig,
    [starsmithConfig.id]: starsmithConfig,
    [feRunnersConfig.id]: feRunnersConfig,
  },
};

// ─── Backward-Compatible Lazy-Loaded Exports ─────────────────────────────────
// These preserve the existing interface expected by rules.slice.ts,
// homebrew.slice.ts, useDataswornTree.ts, and baseRules.ts.

const gameSystem = getSystem();
const activeRulesetId =
  gameSystem === GAME_SYSTEMS.IRONSWORN ? ironswornConfig.id : starforgedConfig.id;
const activeExpansions = includedExpansions[activeRulesetId];

let ruleset: Datasworn.Ruleset | undefined = undefined;
(async () => {
  ruleset = await includedRulesets[activeRulesetId].load();
  useStore.getState().rules.setBaseRuleset(ruleset);
})();

const defaultExpansions: Record<string, Datasworn.Expansion> = {};
const thirdPartyExpansions: Record<string, Datasworn.Expansion> = {};
(async () => {
  for (const config of Object.values(activeExpansions)) {
    const expansion = await config.load();
    if (config.isHomebrew) {
      thirdPartyExpansions[expansion._id] = expansion;
    } else {
      defaultExpansions[expansion._id] = expansion;
    }
  }
})();

export { ruleset, defaultExpansions, thirdPartyExpansions };
