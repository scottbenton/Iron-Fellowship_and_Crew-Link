import {
  ConditionMeterRule,
  Expansion,
  ImpactCategory,
  Ruleset,
  SpecialTrackRule,
  StatRule,
} from "@datasworn/core";

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
  | "site_domains"
  | "rules";

type additions = {
  uids: string[];
  creatorUid: string;
};

export type BaseExpansion = Omit<Expansion, RuleKeys> & additions;
export type BaseRuleset = Omit<Ruleset, RuleKeys> & additions;

export type BaseExpansionOrRuleset = BaseExpansion | BaseRuleset;

export interface StoredRules {
  stats: {
    [statKey: string]: {
      label: string;
      description: string;
    };
  };
  condition_meters: {
    [conditionMeterKey: string]: ConditionMeterRule;
  };
  impacts: {
    [impactKey: string]: ImpactCategory;
  };
  specialTracks: {
    [trackKey: string]: SpecialTrackRule;
  };
}
