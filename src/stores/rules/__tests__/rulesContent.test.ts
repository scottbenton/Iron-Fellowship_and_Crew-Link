import { describe, expect, it, vi, beforeEach } from "vitest";
import { Datasworn } from "@datasworn/core";
import { createRulesSlice } from "../rules.slice";
import { getLinkedDialogKind } from "components/features/charactersAndCampaigns/LinkedDialog/LinkedDialogContent/getLinkedDialogKind";
import { idMap } from "data/idMap";
import classicJson from "@datasworn/ironsworn-classic/json/classic.json";
import delveJson from "@datasworn/ironsworn-classic-delve/json/delve.json";
import starforgedJson from "@datasworn/starforged/json/starforged.json";
import sunderedIslesJson from "@datasworn/sundered-isles/json/sundered_isles.json";
import starsmithJson from "@datasworn-community-content/starsmith/json/starsmith.json";
import ironsmithJson from "@datasworn-community-content/ironsmith/json/ironsmith.json";
import lodestarJson from "data/lodestar.json";

const rulesetsMock = vi.hoisted(() => ({
  ruleset: undefined,
  defaultExpansions: {} as Record<string, Datasworn.Expansion>,
  thirdPartyExpansions: {} as Record<string, Datasworn.Expansion>,
  loadIncludedRuleset: vi.fn(),
  loadIncludedExpansion: vi.fn(),
}));

vi.mock("hooks/useGameSystem", () => ({ getSystem: () => "ironsworn" }));
vi.mock("data/rulesets", () => rulesetsMock);

const classic = classicJson as unknown as Datasworn.Ruleset;
const starforged = starforgedJson as unknown as Datasworn.Ruleset;
const delve = delveJson as unknown as Datasworn.Expansion;
const lodestar = lodestarJson as unknown as Datasworn.Expansion;
const sunderedIsles = sunderedIslesJson as unknown as Datasworn.Expansion;
const starsmith = starsmithJson as unknown as Datasworn.Expansion;
const ironsmith = ironsmithJson as unknown as Datasworn.Expansion;

const EXPANSIONS = [delve, lodestar, sunderedIsles, starsmith, ironsmith];

type TestState = {
  rules: ReturnType<typeof createRulesSlice>;
  homebrew: { collections: Record<string, unknown>; expansions: Record<string, unknown> };
};

/** Builds the rules exactly as rebuildRules does at runtime. */
function buildRules(ruleset: Datasworn.Ruleset, expansionIds: string[] = []) {
  const state = { homebrew: { collections: {}, expansions: {} } } as TestState;
  state.rules = createRulesSlice(
    ((updater: (store: TestState) => void) => updater(state)) as never,
    (() => state) as never,
    undefined as never,
  );

  state.rules.setBaseRuleset(ruleset);
  state.rules.expansionIds = expansionIds;
  state.rules.rebuildRules();

  return state.rules;
}

const COMBOS: [string, Datasworn.Ruleset, string[]][] = [
  ["classic", classic, []],
  ["classic + delve", classic, ["delve"]],
  ["classic + lodestar", classic, ["lodestar"]],
  ["classic + ironsmith", classic, ["ironsmith"]],
  ["classic + everything", classic, ["delve", "lodestar", "ironsmith"]],
  ["starforged", starforged, []],
  ["starforged + sundered isles", starforged, ["sundered_isles"]],
  ["starforged + everything", starforged, ["sundered_isles", "starsmith"]],
];

/** The move names the moves list actually renders, in order. */
function renderedMoves(rules: ReturnType<typeof createRulesSlice>) {
  return rules.rootMoveCollectionIds.map((categoryId) => {
    const category = rules.moveMaps.moveCategoryMap[categoryId];
    return {
      id: categoryId,
      name: category.name,
      moves: Object.values(category.contents ?? {}).map(
        (move) => rules.moveMaps.moveMap[move._id]?.name ?? `MISSING:${move._id}`,
      ),
    };
  });
}

beforeEach(() => {
  rulesetsMock.defaultExpansions = {};
  rulesetsMock.thirdPartyExpansions = {};
  EXPANSIONS.forEach((expansion) => {
    rulesetsMock.defaultExpansions[expansion._id] = expansion;
  });
});

describe("rendered move list", () => {
  it.each(COMBOS)("has no duplicate rows in %s", (_label, ruleset, expansionIds) => {
    const duplicates = renderedMoves(buildRules(ruleset, expansionIds)).flatMap(
      (category) => {
        const seen = new Set<string>();
        return category.moves
          .filter((name) => seen.has(name) || (seen.add(name), false))
          .map((name) => `${category.name}: ${name}`);
      },
    );

    expect(duplicates).toEqual([]);
  });

  it.each(COMBOS)("has no duplicate headings in %s", (_label, ruleset, expansionIds) => {
    const seen = new Set<string>();
    const duplicates = renderedMoves(buildRules(ruleset, expansionIds))
      .map((category) => category.name)
      .filter((name) => seen.has(name) || (seen.add(name), false));

    expect(duplicates).toEqual([]);
  });

  it("shows Delve's alternate Reveal a Danger in place of the original", () => {
    const rules = buildRules(classic, ["delve"]);
    const delveMoves = renderedMoves(rules).find(
      (category) => category.id === "move_category:delve/delve",
    );

    expect(delveMoves?.moves).toEqual([
      "Discover a Site",
      "Delve the Depths",
      "Find an Opportunity",
      "Check Your Gear",
      "Locate Your Objective",
      "Escape the Depths",
      "Reveal a Danger (alternate version)",
    ]);
  });

  it("keeps Starforged exploration whole under Sundered Isles", () => {
    const rules = buildRules(starforged, ["sundered_isles"]);
    const exploration = renderedMoves(rules).find(
      (category) => category.id === "move_category:starforged/exploration",
    );

    expect(exploration?.moves).toEqual([
      "Undertake an Expedition",
      "Explore a Waypoint",
      "Make a Discovery",
      "Confront Chaos",
      "Finish an Expedition",
      "Set a Course",
    ]);
    expect(
      rules.moveMaps.moveMap["move:starforged/exploration/set_a_course"]._id,
    ).toBe("move:sundered_isles/exploration/set_a_course");
  });

  it("still merges Lodestar's added move into Classic's adventure moves", () => {
    const rules = buildRules(classic, ["lodestar"]);
    const adventure = renderedMoves(rules).find(
      (category) => category.id === "move_category:classic/adventure",
    );

    expect(adventure?.moves).toContain("Follow a Path");
    expect(adventure?.moves).toContain("Face Danger");
  });

  it.each(COMBOS)("renders every move in %s", (_label, ruleset, expansionIds) => {
    const missing = renderedMoves(buildRules(ruleset, expansionIds)).flatMap(
      (category) => category.moves.filter((name) => name.startsWith("MISSING:")),
    );

    expect(missing).toEqual([]);
  });
});

describe("datasworn links", () => {
  /** Which rules packages are loaded, so links into absent ones can be skipped. */
  function loadedPackageIds(ruleset: Datasworn.Ruleset, expansionIds: string[]) {
    return new Set([ruleset._id, ...expansionIds]);
  }

  function linkedIds(ruleset: Datasworn.Ruleset, expansionIds: string[]) {
    const packages = [
      ruleset,
      ...EXPANSIONS.filter((e) => expansionIds.includes(e._id)),
    ];
    const found = new Set<string>();
    const pattern = /datasworn:([A-Za-z0-9_.\-/:]+)/g;
    const serialized = JSON.stringify(packages);

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(serialized)) !== null) {
      found.add(idMap[match[1]] ?? match[1]);
    }
    return [...found];
  }

  it.each(COMBOS)(
    "every link in %s opens the dialog it points at",
    (_label, ruleset, expansionIds) => {
      const rules = buildRules(ruleset, expansionIds);
      const loaded = loadedPackageIds(ruleset, expansionIds);

      const broken = linkedIds(ruleset, expansionIds).filter((id) => {
        // A link into an expansion the game has not enabled cannot resolve.
        const packageId = id.split(":")[1]?.split("/")[0];
        if (!packageId || !loaded.has(packageId)) return false;

        switch (getLinkedDialogKind(id)) {
          case "move":
            return !rules.moveMaps.moveMap[id];
          case "oracle":
            return !rules.oracleMaps.allOraclesMap[id];
          case "asset":
            return !rules.assetMaps.assetMap[id];
          default:
            // Types no dialog claims to render: truths, NPCs, atlas entries.
            return false;
        }
      });

      expect(broken).toEqual([]);
    },
  );
});
