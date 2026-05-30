import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRulesSlice } from "../rules.slice";

const baseRuleset = {
  _id: "classic",
  oracles: {},
  moves: {},
  assets: {},
  truths: {},
  rules: {
    stats: { edge: { label: "Edge" } },
    condition_meters: {},
    special_tracks: {},
    impacts: {},
  },
};

const delveExpansion = {
  _id: "delve",
  oracles: {},
  moves: {},
  assets: {},
  truths: {},
  rules: {
    stats: { shadow: { label: "Shadow" } },
    condition_meters: {},
    special_tracks: {},
    impacts: {},
  },
};

const rulesetsMock = vi.hoisted(() => ({
  ruleset: undefined,
  defaultExpansions: {} as Record<string, typeof delveExpansion>,
  thirdPartyExpansions: {} as Record<string, typeof delveExpansion>,
  loadIncludedRuleset: vi.fn(),
  loadIncludedExpansion: vi.fn(),
}));

vi.mock("hooks/useGameSystem", () => ({
  getSystem: () => "ironsworn",
}));

vi.mock("data/rulesets", () => rulesetsMock);

type TestState = {
  rules: ReturnType<typeof createRulesSlice>;
  homebrew: {
    collections: Record<string, unknown>;
    expansions: Record<string, typeof delveExpansion>;
  };
};

function createTestState(): TestState {
  const state = {
    homebrew: {
      collections: {},
      expansions: {},
    },
  } as TestState;

  const set = (updater: (store: TestState) => void) => {
    updater(state);
  };

  state.rules = createRulesSlice(
    set as never,
    (() => state) as never,
    undefined as never,
  );

  return state;
}

describe("createRulesSlice lazy loading", () => {
  beforeEach(() => {
    delete rulesetsMock.defaultExpansions.delve;
    delete rulesetsMock.thirdPartyExpansions.delve;
    rulesetsMock.loadIncludedRuleset.mockResolvedValue(baseRuleset);
    rulesetsMock.loadIncludedExpansion.mockImplementation(async (id: string) => {
      if (id !== "delve") {
        return undefined;
      }

      rulesetsMock.defaultExpansions.delve = delveExpansion;
      return delveExpansion;
    });
  });

  it("loads and applies the base ruleset on demand", async () => {
    const state = createTestState();

    await state.rules.loadBaseRuleset();

    expect(rulesetsMock.loadIncludedRuleset).toHaveBeenCalled();
    expect(state.rules.baseRuleset?._id).toBe("classic");
    expect(state.rules.stats).toHaveProperty("edge");
  });

  it("loads included expansions and rebuilds rules after they resolve", async () => {
    const state = createTestState();
    state.rules.setBaseRuleset(baseRuleset as never);
    state.rules.expansionIds = ["delve"];

    await state.rules.loadIncludedExpansions(["delve"]);

    expect(rulesetsMock.loadIncludedExpansion).toHaveBeenCalledWith("delve");
    expect(state.rules.stats).toHaveProperty("edge");
    expect(state.rules.stats).toHaveProperty("shadow");
  });

  it("triggers included expansion loading when expansion IDs change", async () => {
    const state = createTestState();
    state.rules.setBaseRuleset(baseRuleset as never);

    state.rules.setExpansionIds(["delve"]);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(rulesetsMock.loadIncludedExpansion).toHaveBeenCalledWith("delve");
    expect(state.rules.stats).toHaveProperty("shadow");
  });
});
