import { Datasworn, IdParser } from "@datasworn-community/core";
import { useEffect } from "react";
import { useStore } from "stores/store";
import { useDataswornTree } from "./useDataswornTree";

export function loadBaseRulesetForSync(
  loadBaseRuleset: () => Promise<void>,
): void {
  loadBaseRuleset().catch(console.error);
}

export function syncDataswornTree(
  tree: Record<string, Datasworn.RulesPackage> | undefined,
): void {
  if (tree) {
    IdParser.tree = tree;
  }
}

export function useSyncDataswornTree() {
  const loadBaseRuleset = useStore((store) => store.rules.loadBaseRuleset);
  const tree = useDataswornTree();

  useEffect(() => {
    loadBaseRulesetForSync(loadBaseRuleset);
  }, [loadBaseRuleset]);

  useEffect(() => {
    syncDataswornTree(tree);
  }, [tree]);
}
