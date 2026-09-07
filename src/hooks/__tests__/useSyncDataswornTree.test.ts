import { IdParser } from "@datasworn-community/core";
import { describe, expect, it, vi } from "vitest";
import { loadBaseRulesetForSync, syncDataswornTree } from "../useSyncDataswornTree";

vi.mock("stores/store", () => ({
  useStore: vi.fn(),
}));

vi.mock("../useDataswornTree", () => ({
  useDataswornTree: vi.fn(),
}));

describe("loadBaseRulesetForSync", () => {
  it("triggers the base ruleset load", async () => {
    const loadBaseRuleset = vi.fn().mockResolvedValue(undefined);

    loadBaseRulesetForSync(loadBaseRuleset);
    await Promise.resolve();

    expect(loadBaseRuleset).toHaveBeenCalledOnce();
  });
});

describe("syncDataswornTree", () => {
  it("updates the Datasworn ID parser tree when rules data is available", () => {
    const tree = {
      classic: {
        _id: "classic",
        type: "ruleset",
      },
    };

    syncDataswornTree(tree as never);

    expect(IdParser.tree).toBe(tree);
  });

  it("leaves the existing tree alone while rules data is unavailable", () => {
    const tree = {
      classic: {
        _id: "classic",
        type: "ruleset",
      },
    };
    IdParser.tree = tree as never;

    syncDataswornTree(undefined);

    expect(IdParser.tree).toBe(tree);
  });
});
