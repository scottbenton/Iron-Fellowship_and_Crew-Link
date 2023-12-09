import { Expansion, Ruleset } from "@datasworn/core";

type RuleKeys =
  | "oracles"
  | "moves"
  | "assets"
  | "atlas"
  | "npcs"
  | "truths"
  | "rarities"
  | "delve_sites"
  | "site_themes"
  | "site_domains";

type additions = {
  uids: string[];
  creatorUid: string;
};

export type BaseExpansion = Omit<Expansion, RuleKeys> & additions;
export type BaseRuleset = Omit<Ruleset, RuleKeys> & additions;

export type BaseExpansionOrRuleset = BaseExpansion | BaseRuleset;
