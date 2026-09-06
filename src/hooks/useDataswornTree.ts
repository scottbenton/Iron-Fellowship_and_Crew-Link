import { Datasworn } from "@datasworn-community/core";
import { defaultExpansions, thirdPartyExpansions } from "data/rulesets";
import { useMemo } from "react";
import { useStore } from "stores/store";

export function useDataswornTree() {
  const ruleset = useStore((store) => store.rules.baseRuleset);
  const homebrewExpansions = useStore((store) => store.homebrew.expansions);
  const activeExpansionIds = useStore((store) => store.rules.expansionIds);

  const tree = useMemo(() => {
    if (ruleset) {
      const expansions: Record<string, Datasworn.Expansion> = {};
      activeExpansionIds.forEach((expansionId) => {
        const expansion =
          homebrewExpansions[expansionId] ??
          defaultExpansions[expansionId] ??
          thirdPartyExpansions[expansionId];
        if (expansion) {
          expansions[expansion._id] = expansion;
        }
      });
      return { [ruleset._id]: ruleset, ...expansions };
    }
  }, [homebrewExpansions, activeExpansionIds, ruleset]);

  return tree;
}
