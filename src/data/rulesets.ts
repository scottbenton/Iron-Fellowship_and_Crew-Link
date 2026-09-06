import { Datasworn } from "@datasworn-community/core";
import { getSystem } from "hooks/useGameSystem";
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
    const { classic } = await import("@datasworn-community/ironsworn-classic");
    return classic;
  },
};

export const starforgedConfig: IRulesetConfig = {
  id: "starforged",
  name: "Starforged",
  type: "ruleset",
  isHomebrew: false,
  load: async () => {
    const { starforged } = await import("@datasworn-community/starforged");
    return starforged;
  },
};

// ─── Official Ironsworn Expansions ────────────────────────────────────────────

export const ironswornDelveConfig: IExpansionConfig = {
  id: "delve",
  name: "Ironsworn: Delve",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const { delve } = await import(
      "@datasworn-community/ironsworn-classic-delve"
    );
    return delve;
  },
};

export const ironswornLodestarConfig: IExpansionConfig = {
  id: "lodestar",
  name: "Ironsworn Lodestar",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const { lodestar } = await import(
      "@datasworn-community/ironsworn-classic-lodestar"
    );
    return lodestar;
  },
};

// ─── Official Starforged Expansions ──────────────────────────────────────────

export const sunderedIslesConfig: IExpansionConfig = {
  id: "sundered_isles",
  name: "Sundered Isles",
  type: "expansion",
  isHomebrew: false,
  load: async () => {
    const { sundered_isles } = await import(
      "@datasworn-community/sundered-isles"
    );
    return sundered_isles;
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
    const { ironsmith } = await import("@datasworn-community/ironsmith");
    return ironsmith;
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
    const { starsmith } = await import("@datasworn-community/starsmith");
    return starsmith;
  },
};

// Fe-Runners is not ready to expose yet.
// export const feRunnersConfig: IExpansionConfig = {
//   id: "fe_runners",
//   name: "Fe-Runners",
//   type: "expansion",
//   isHomebrew: true,
//   licenseInfo: {
//     license: "CC BY-NC-SA 4.0",
//     licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
//     url: "https://zombiecraig.itch.io/",
//     author: "Craig Smith",
//   },
//   load: async () => {
//     const { fe_runners } = await import("@datasworn-community/fe-runners");
//     return fe_runners;
//   },
// };

// ─── Organized Collections ───────────────────────────────────────────────────

export const includedRulesets: Record<string, IRulesetConfig> = {
  [ironswornConfig.id]: ironswornConfig,
  [starforgedConfig.id]: starforgedConfig,
};

/** All expansions organized by their parent ruleset id. */
export const includedExpansions: Record<
  string,
  Record<string, IExpansionConfig>
> = {
  [ironswornConfig.id]: {
    [ironswornDelveConfig.id]: ironswornDelveConfig,
    [ironswornLodestarConfig.id]: ironswornLodestarConfig,
    [ironsmithConfig.id]: ironsmithConfig,
  },
  [starforgedConfig.id]: {
    [sunderedIslesConfig.id]: sunderedIslesConfig,
    [starsmithConfig.id]: starsmithConfig,
    // [feRunnersConfig.id]: feRunnersConfig,
  },
};

// ─── Backward-Compatible Lazy-Loaded Exports ─────────────────────────────────
// These preserve the existing interface expected by rules.slice.ts,
// homebrew.slice.ts, useDataswornTree.ts, and baseRules.ts.

const gameSystem = getSystem();
const activeRulesetId =
  gameSystem === GAME_SYSTEMS.IRONSWORN
    ? ironswornConfig.id
    : starforgedConfig.id;

let ruleset: Datasworn.Ruleset | undefined = undefined;
const defaultExpansions: Record<string, Datasworn.Expansion> = {};
const thirdPartyExpansions: Record<string, Datasworn.Expansion> = {};

const rulesetLoadPromises: Record<string, Promise<Datasworn.Ruleset>> = {};
const expansionLoadPromises: Record<string, Promise<Datasworn.Expansion>> = {};

export function preloadActiveRuleset(): Promise<Datasworn.Ruleset> {
  return loadIncludedRuleset(activeRulesetId);
}

export function findIncludedExpansionConfig(
  expansionId: string
): IExpansionConfig | undefined {
  for (const expansions of Object.values(includedExpansions)) {
    const config = expansions[expansionId];
    if (config) {
      return config;
    }
  }
}

export async function loadIncludedRuleset(
  rulesetId = activeRulesetId
): Promise<Datasworn.Ruleset> {
  if (ruleset?._id === rulesetId) {
    return ruleset;
  }

  const config = includedRulesets[rulesetId];
  if (!config) {
    throw new Error(`Unknown included ruleset: ${rulesetId}`);
  }

  rulesetLoadPromises[rulesetId] ??= config.load().then((loadedRuleset) => {
    if (rulesetId === activeRulesetId) {
      ruleset = loadedRuleset;
    }
    return loadedRuleset;
  });

  return rulesetLoadPromises[rulesetId];
}

export async function loadIncludedExpansion(
  expansionId: string
): Promise<Datasworn.Expansion | undefined> {
  const existingExpansion =
    defaultExpansions[expansionId] ?? thirdPartyExpansions[expansionId];
  if (existingExpansion) {
    return existingExpansion;
  }

  const config = findIncludedExpansionConfig(expansionId);
  if (!config) {
    return undefined;
  }

  expansionLoadPromises[expansionId] ??= config.load().then((expansion) => {
    if (config.isHomebrew) {
      thirdPartyExpansions[expansion._id] = expansion;
    } else {
      defaultExpansions[expansion._id] = expansion;
    }
    return expansion;
  });

  return expansionLoadPromises[expansionId];
}

preloadActiveRuleset().catch(console.error);

export { ruleset, defaultExpansions, thirdPartyExpansions };
