import { describe, it, expect } from "vitest";
import {
  buildMoveCategoryId,
  buildMoveId,
  buildMoveConditionId,
  buildMoveOutcomeId,
  convertStoredMovesToCategories,
} from "../convertStoredMovesToCategories";
import { MoveType } from "api-calls/homebrew/moves/moves/_homebrewMove.type";
import type { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";
import type {
  HomebrewMoveNoRoll,
  HomebrewMoveActionRoll,
  HomebrewMoveProgressRoll,
  HomebrewMoveSpecialTrackRoll,
} from "api-calls/homebrew/moves/moves/_homebrewMove.type";

// ─── ID builder tests ─────────────────────────────────────────────────────────

describe("buildMoveCategoryId", () => {
  it("produces the correct format", () => {
    expect(buildMoveCategoryId("my_homebrew", "combat")).toBe(
      "move_category:my_homebrew/combat",
    );
  });

  it("includes both homebrewId and categoryId", () => {
    const id = buildMoveCategoryId("abc", "xyz");
    expect(id).toContain("abc");
    expect(id).toContain("xyz");
  });
});

describe("buildMoveId", () => {
  it("produces the correct format", () => {
    expect(buildMoveId("my_homebrew", "combat", "strike")).toBe(
      "move:my_homebrew/combat/strike",
    );
  });

  it("includes the move: prefix", () => {
    expect(buildMoveId("h", "c", "m")).toMatch(/^move:/);
  });
});

describe("buildMoveConditionId", () => {
  it("produces the correct format", () => {
    expect(buildMoveConditionId("hb", "combat", "strike", 0)).toBe(
      "move.condition:hb/combat/strike.0",
    );
  });

  it("appends the numeric index", () => {
    expect(buildMoveConditionId("hb", "c", "m", 2)).toContain(".2");
  });

  it("produces unique ids for different indices", () => {
    const id0 = buildMoveConditionId("hb", "c", "m", 0);
    const id1 = buildMoveConditionId("hb", "c", "m", 1);
    expect(id0).not.toBe(id1);
  });
});

describe("buildMoveOutcomeId", () => {
  it("produces the correct format for strong_hit", () => {
    expect(buildMoveOutcomeId("hb", "combat", "strike", "strong_hit")).toBe(
      "move.outcome:hb/combat/strike.strong_hit",
    );
  });

  it("produces the correct format for weak_hit", () => {
    expect(buildMoveOutcomeId("hb", "c", "m", "weak_hit")).toContain(
      ".weak_hit",
    );
  });

  it("produces the correct format for miss", () => {
    expect(buildMoveOutcomeId("hb", "c", "m", "miss")).toContain(".miss");
  });

  it("produces unique ids for different outcomes", () => {
    const ids = (
      ["strong_hit", "weak_hit", "miss"] as const
    ).map((o) => buildMoveOutcomeId("hb", "c", "m", o));
    expect(new Set(ids).size).toBe(3);
  });
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_CATEGORY: HomebrewMoveCategoryDocument = {
  collectionId: "homebrew_collection",
  label: "Combat",
};

const BASE_MOVE_FIELDS = {
  collectionId: "homebrew_collection",
  categoryId: "combat",
  label: "Strike",
  text: "Roll +iron.",
};

const NO_ROLL_MOVE: HomebrewMoveNoRoll = {
  ...BASE_MOVE_FIELDS,
  type: MoveType.NoRoll,
};

const ACTION_ROLL_MOVE: HomebrewMoveActionRoll = {
  ...BASE_MOVE_FIELDS,
  type: MoveType.ActionRoll,
  stats: ["iron", "edge"],
  conditionMeters: ["health"],
  assetControls: ["integrity"],
};

const PROGRESS_ROLL_MOVE: HomebrewMoveProgressRoll = {
  ...BASE_MOVE_FIELDS,
  type: MoveType.ProgressRoll,
  category: "Combat",
};

const SPECIAL_TRACK_MOVE: HomebrewMoveSpecialTrackRoll = {
  ...BASE_MOVE_FIELDS,
  type: MoveType.SpecialTrack,
  specialTracks: ["bonds_legacy", "quests_legacy"],
};

// ─── convertStoredMovesToCategories ──────────────────────────────────────────

describe("convertStoredMovesToCategories — categories", () => {
  it("creates a category for each stored category", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY, exploration: { ...BASE_CATEGORY, label: "Exploration" } },
      {},
    );
    expect(Object.keys(result)).toHaveLength(2);
    expect(result).toHaveProperty("combat");
    expect(result).toHaveProperty("exploration");
  });

  it("sets the correct _id on categories", () => {
    const result = convertStoredMovesToCategories("my_hb", { cat1: BASE_CATEGORY }, {});
    expect(result.cat1._id).toBe("move_category:my_hb/cat1");
  });

  it("does not wrap the _id in extra quotes", () => {
    const result = convertStoredMovesToCategories("hb", { cat1: BASE_CATEGORY }, {});
    expect(result.cat1._id).not.toContain('"');
  });

  it("sets name from label", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { cat1: { ...BASE_CATEGORY, label: "My Category" } },
      {},
    );
    expect(result.cat1.name).toBe("My Category");
  });

  it("sets description when provided", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { cat1: { ...BASE_CATEGORY, description: "Some description" } },
      {},
    );
    expect(result.cat1.description).toBe("Some description");
  });

  it("sets enhances when enhancesId is provided", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { cat1: { ...BASE_CATEGORY, enhancesId: "move_category:classic/combat" } },
      {},
    );
    expect(result.cat1.enhances).toEqual(["move_category:classic/combat"]);
  });

  it("sets replaces when replacesId is provided", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { cat1: { ...BASE_CATEGORY, replacesId: "move_category:classic/combat" } },
      {},
    );
    expect(result.cat1.replaces).toEqual(["move_category:classic/combat"]);
  });

  it("omits enhances when enhancesId is absent", () => {
    const result = convertStoredMovesToCategories("hb", { cat1: BASE_CATEGORY }, {});
    expect(result.cat1.enhances).toBeUndefined();
  });

  it("omits replaces when replacesId is absent", () => {
    const result = convertStoredMovesToCategories("hb", { cat1: BASE_CATEGORY }, {});
    expect(result.cat1.replaces).toBeUndefined();
  });

  it("sorts categories alphabetically by label", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      {
        z_cat: { ...BASE_CATEGORY, label: "Zzz" },
        a_cat: { ...BASE_CATEGORY, label: "Aaa" },
      },
      {},
    );
    // Both categories should be present regardless of order
    expect(result).toHaveProperty("z_cat");
    expect(result).toHaveProperty("a_cat");
  });
});

describe("convertStoredMovesToCategories — move placement", () => {
  it("places a move in its category", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { strike: NO_ROLL_MOVE },
    );
    expect(result.combat.contents).toHaveProperty("strike");
  });

  it("places multiple moves from different categories correctly", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      {
        combat: BASE_CATEGORY,
        exploration: { ...BASE_CATEGORY, label: "Exploration" },
      },
      {
        strike: { ...NO_ROLL_MOVE, categoryId: "combat" },
        navigate: { ...NO_ROLL_MOVE, categoryId: "exploration", label: "Navigate" },
      },
    );
    expect(result.combat.contents).toHaveProperty("strike");
    expect(result.exploration.contents).toHaveProperty("navigate");
  });
});

// ─── NoRoll moves ─────────────────────────────────────────────────────────────

describe("convertStoredMovesToCategories — NoRoll move", () => {
  function getMove() {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { strike: NO_ROLL_MOVE },
    );
    return result.combat.contents!["strike"] as ReturnType<
      typeof convertStoredMovesToCategories
    >["string"]["contents"]["string"];
  }

  it("sets roll_type to no_roll", () => {
    expect(getMove().roll_type).toBe("no_roll");
  });

  it("sets _id with move: prefix", () => {
    expect(getMove()._id).toBe("move:hb/combat/strike");
  });

  it("does not use the old broken id format (missing move: prefix)", () => {
    expect(getMove()._id).not.toMatch(/^hb\//);
  });

  it("sets name from label", () => {
    expect(getMove().name).toBe("Strike");
  });

  it("sets text", () => {
    expect(getMove().text).toBe("Roll +iron.");
  });

  it("sets replaces when replacesId is provided", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { strike: { ...NO_ROLL_MOVE, replacesId: "move:classic/combat/strike" } },
    );
    expect(result.combat.contents!["strike"].replaces).toEqual([
      "move:classic/combat/strike",
    ]);
  });
});

// ─── ActionRoll moves ─────────────────────────────────────────────────────────

describe("convertStoredMovesToCategories — ActionRoll move", () => {
  function getMove() {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { strike: ACTION_ROLL_MOVE },
    );
    return result.combat.contents!["strike"] as import("@datasworn-community/core").Datasworn.MoveActionRoll;
  }

  it("sets roll_type to action_roll", () => {
    expect(getMove().roll_type).toBe("action_roll");
  });

  it("sets _id with move: prefix", () => {
    expect(getMove()._id).toBe("move:hb/combat/strike");
  });

  it("builds stat roll options correctly", () => {
    const conditions = getMove().trigger.conditions;
    const statCondition = conditions.find(
      (c) => c.roll_options?.[0]?.using === "stat",
    );
    expect(statCondition?.roll_options).toEqual([
      { using: "stat", stat: "iron" },
      { using: "stat", stat: "edge" },
    ]);
  });

  it("builds condition_meter roll options correctly", () => {
    const conditions = getMove().trigger.conditions;
    const meterCondition = conditions.find(
      (c) => c.roll_options?.[0]?.using === "condition_meter",
    );
    expect(meterCondition?.roll_options).toEqual([
      { using: "condition_meter", condition_meter: "health" },
    ]);
  });

  it("builds asset_control roll options correctly", () => {
    const conditions = getMove().trigger.conditions;
    const controlCondition = conditions.find(
      (c) => c.roll_options?.[0]?.using === "asset_control",
    );
    expect(controlCondition?.roll_options).toEqual([
      { using: "asset_control", control: "integrity", assets: ["*"] },
    ]);
  });

  it("sets _id on all trigger conditions", () => {
    const conditions = getMove().trigger.conditions;
    conditions.forEach((c) => {
      expect(c._id).toBeDefined();
      expect(c._id).toMatch(/^move\.condition:/);
    });
  });

  it("assigns unique _ids to each condition", () => {
    const ids = getMove().trigger.conditions.map((c) => c._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sets _id on all move outcomes", () => {
    const outcomes = getMove().outcomes!;
    expect(outcomes.strong_hit._id).toMatch(/^move\.outcome:/);
    expect(outcomes.weak_hit._id).toMatch(/^move\.outcome:/);
    expect(outcomes.miss._id).toMatch(/^move\.outcome:/);
  });

  it("assigns unique _ids to each outcome", () => {
    const o = getMove().outcomes!;
    expect(o.strong_hit._id).not.toBe(o.weak_hit._id);
    expect(o.weak_hit._id).not.toBe(o.miss._id);
  });

  it("encodes the outcome name in the outcome _id", () => {
    const o = getMove().outcomes!;
    expect(o.strong_hit._id).toContain("strong_hit");
    expect(o.weak_hit._id).toContain("weak_hit");
    expect(o.miss._id).toContain("miss");
  });

  it("sets allow_momentum_burn to true", () => {
    expect(getMove().allow_momentum_burn).toBe(true);
  });

  it("handles empty stats array gracefully", () => {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { strike: { ...ACTION_ROLL_MOVE, stats: [] } },
    );
    const move = result.combat.contents!["strike"] as import("@datasworn-community/core").Datasworn.MoveActionRoll;
    const statCond = move.trigger.conditions[0];
    expect(statCond.roll_options).toEqual([]);
  });
});

// ─── ProgressRoll moves ───────────────────────────────────────────────────────

describe("convertStoredMovesToCategories — ProgressRoll move", () => {
  function getMove() {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { fulfill: PROGRESS_ROLL_MOVE },
    );
    return result.combat.contents!["fulfill"] as import("@datasworn-community/core").Datasworn.MoveProgressRoll;
  }

  it("sets roll_type to progress_roll", () => {
    expect(getMove().roll_type).toBe("progress_roll");
  });

  it("sets _id with move: prefix", () => {
    expect(getMove()._id).toBe("move:hb/combat/fulfill");
  });

  it("sets the tracks.category", () => {
    expect(getMove().tracks.category).toBe("Combat");
  });

  it("sets the progress_roll trigger condition", () => {
    const cond = getMove().trigger.conditions[0];
    expect(cond.method).toBe("progress_roll");
    expect(cond.roll_options[0]).toEqual({ using: "progress_track" });
  });

  it("sets _id on the trigger condition", () => {
    const cond = getMove().trigger.conditions[0];
    expect(cond._id).toMatch(/^move\.condition:/);
  });

  it("sets _id on all outcomes", () => {
    const o = getMove().outcomes!;
    expect(o.strong_hit._id).toMatch(/^move\.outcome:/);
    expect(o.weak_hit._id).toMatch(/^move\.outcome:/);
    expect(o.miss._id).toMatch(/^move\.outcome:/);
  });

  it("sets allow_momentum_burn to false", () => {
    expect(getMove().allow_momentum_burn).toBe(false);
  });
});

// ─── SpecialTrack moves ───────────────────────────────────────────────────────

describe("convertStoredMovesToCategories — SpecialTrack move", () => {
  function getMove() {
    const result = convertStoredMovesToCategories(
      "hb",
      { combat: BASE_CATEGORY },
      { advance: SPECIAL_TRACK_MOVE },
    );
    return result.combat.contents!["advance"] as import("@datasworn-community/core").Datasworn.MoveSpecialTrack;
  }

  it("sets roll_type to special_track", () => {
    expect(getMove().roll_type).toBe("special_track");
  });

  it("sets _id with move: prefix", () => {
    expect(getMove()._id).toBe("move:hb/combat/advance");
  });

  it("maps specialTracks to roll_options", () => {
    const cond = getMove().trigger.conditions[0];
    expect(cond.roll_options).toEqual([
      { using: "bonds_legacy" },
      { using: "quests_legacy" },
    ]);
  });

  it("sets _id on the trigger condition", () => {
    const cond = getMove().trigger.conditions[0];
    expect(cond._id).toMatch(/^move\.condition:/);
  });

  it("sets _id on all outcomes", () => {
    const o = getMove().outcomes!;
    expect(o.strong_hit._id).toMatch(/^move\.outcome:/);
    expect(o.weak_hit._id).toMatch(/^move\.outcome:/);
    expect(o.miss._id).toMatch(/^move\.outcome:/);
  });

  it("sets allow_momentum_burn to false", () => {
    expect(getMove().allow_momentum_burn).toBe(false);
  });
});
