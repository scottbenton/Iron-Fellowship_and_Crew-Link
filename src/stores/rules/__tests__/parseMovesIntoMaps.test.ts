import { describe, expect, it, beforeEach } from "vitest";
import { Datasworn, IdParser } from "@datasworn/core";
import { parseMovesIntoMaps } from "../helpers/parseMovesIntoMaps";
import { isFullyReplacingMoveCategory } from "../helpers/isFullyReplacingMoveCategory";
import classicJson from "@datasworn/ironsworn-classic/json/classic.json";
import delveJson from "@datasworn/ironsworn-classic-delve/json/delve.json";
import starforgedJson from "@datasworn/starforged/json/starforged.json";
import sunderedIslesJson from "@datasworn/sundered-isles/json/sundered_isles.json";
import lodestarJson from "data/lodestar.json";

const classic = classicJson as unknown as Datasworn.Ruleset;
const delve = delveJson as unknown as Datasworn.Expansion;
const starforged = starforgedJson as unknown as Datasworn.Ruleset;
const sunderedIsles = sunderedIslesJson as unknown as Datasworn.Expansion;
const lodestar = lodestarJson as unknown as Datasworn.Expansion;

type MoveMaps = ReturnType<typeof parseMovesIntoMaps>;

/** Mirrors rebuildRules: parse the base, then merge each expansion in turn. */
function buildMaps(
  base: Datasworn.RulesPackage,
  expansions: Datasworn.RulesPackage[] = [],
) {
  const tree: Record<string, Datasworn.RulesPackage> = { [base._id]: base };
  IdParser.tree = tree;

  let maps: MoveMaps = parseMovesIntoMaps(base.moves);
  let rootIds = Object.values(base.moves).map((category) => category._id);

  expansions.forEach((expansion) => {
    tree[expansion._id] = expansion;
    const expansionMaps = parseMovesIntoMaps(expansion.moves);

    maps = {
      moveCategoryMap: {
        ...maps.moveCategoryMap,
        ...expansionMaps.moveCategoryMap,
      },
      nonReplacedMoveCategoryMap: {
        ...maps.nonReplacedMoveCategoryMap,
        ...expansionMaps.nonReplacedMoveCategoryMap,
      },
      moveMap: { ...maps.moveMap, ...expansionMaps.moveMap },
      nonReplacedMoveMap: {
        ...maps.nonReplacedMoveMap,
        ...expansionMaps.nonReplacedMoveMap,
      },
    };

    rootIds = rootIds.concat(
      Object.values(expansion.moves)
        .filter(
          (category) =>
            !category.enhances &&
            !category.replaces &&
            !isFullyReplacingMoveCategory(category, maps.nonReplacedMoveMap),
        )
        .map((category) => category._id),
    );
  });

  return { maps, rootIds };
}

/** The names the moves list actually renders for a root collection. */
function renderedMoveNames(maps: MoveMaps, categoryId: string): string[] {
  const category = maps.moveCategoryMap[categoryId];
  return Object.values(category.contents ?? {}).map(
    (move) => maps.moveMap[move._id]?.name ?? `MISSING:${move._id}`,
  );
}

describe("parseMovesIntoMaps", () => {
  beforeEach(() => {
    IdParser.tree = {};
  });

  describe("a move replacing a sibling in the same collection", () => {
    const REVEAL_A_DANGER = "move:delve/delve/reveal_a_danger";
    const REVEAL_A_DANGER_ALT = "move:delve/delve/reveal_a_danger_alt";
    const DELVE_MOVES = "move_category:delve/delve";

    it("renders the replacement exactly once", () => {
      const { maps } = buildMaps(classic, [delve]);
      const names = renderedMoveNames(maps, DELVE_MOVES);

      expect(
        names.filter((name) => name === "Reveal a Danger (alternate version)"),
      ).toHaveLength(1);
      expect(names).not.toContain("Reveal a Danger");
    });

    it("drops the replaced move from the collection contents", () => {
      const { maps } = buildMaps(classic, [delve]);
      const contentIds = Object.values(
        maps.moveCategoryMap[DELVE_MOVES].contents ?? {},
      ).map((move) => move._id);

      expect(contentIds).not.toContain(REVEAL_A_DANGER);
      expect(contentIds).toContain(REVEAL_A_DANGER_ALT);
    });

    it("still resolves the replaced id to the replacement", () => {
      const { maps } = buildMaps(classic, [delve]);

      // Links in other content still point at the original id.
      expect(maps.moveMap[REVEAL_A_DANGER]._id).toBe(REVEAL_A_DANGER_ALT);
      expect(maps.moveMap[REVEAL_A_DANGER_ALT]._id).toBe(REVEAL_A_DANGER_ALT);
    });

    it("leaves the rest of the Delve collection intact", () => {
      const { maps } = buildMaps(classic, [delve]);

      expect(renderedMoveNames(maps, DELVE_MOVES)).toEqual([
        "Discover a Site",
        "Delve the Depths",
        "Find an Opportunity",
        "Check Your Gear",
        "Locate Your Objective",
        "Escape the Depths",
        "Reveal a Danger (alternate version)",
      ]);
    });
  });

  describe("a move replacing one in a different collection", () => {
    it("keeps the Starforged collection complete under Sundered Isles", () => {
      const { maps } = buildMaps(starforged, [sunderedIsles]);

      expect(
        renderedMoveNames(maps, "move_category:starforged/exploration"),
      ).toEqual([
        "Undertake an Expedition",
        "Explore a Waypoint",
        "Make a Discovery",
        "Confront Chaos",
        "Finish an Expedition",
        "Set a Course",
      ]);
      // ...and renders the Sundered Isles versions in those slots.
      expect(
        maps.moveMap["move:starforged/exploration/set_a_course"]._id,
      ).toBe("move:sundered_isles/exploration/set_a_course");
    });

    it("keeps the Classic collection complete under Lodestar", () => {
      const { maps } = buildMaps(classic, [lodestar]);

      expect(
        renderedMoveNames(maps, "move_category:classic/adventure"),
      ).toEqual([
        "Face Danger",
        "Secure an Advantage",
        "Gather Information",
        "Heal",
        "Resupply",
        "Make Camp",
        "Undertake a Journey",
        "Reach Your Destination",
      ]);
    });
  });

  describe("root collections", () => {
    it("hides a collection whose every move is a replacement", () => {
      const { rootIds } = buildMaps(starforged, [sunderedIsles]);

      expect(rootIds).not.toContain("move_category:sundered_isles/exploration");
      expect(rootIds).toContain("move_category:starforged/exploration");
    });

    it("keeps a collection that only partly replaces", () => {
      const { rootIds } = buildMaps(classic, [delve]);

      // One of the eight Delve moves is a replacement; the collection stays.
      expect(rootIds).toContain("move_category:delve/delve");
    });

    it("keeps a collection with no replacements at all", () => {
      const { rootIds } = buildMaps(classic, [lodestar]);

      expect(rootIds).toContain("move_category:lodestar/scene_challenge");
    });

    it("keeps a collection when a replacement target is not loaded", () => {
      // Sundered Isles without Starforged underneath: nothing to fall back to,
      // so the collection has to keep rendering.
      const { rootIds } = buildMaps(classic, [sunderedIsles]);

      expect(rootIds).toContain("move_category:sundered_isles/exploration");
    });
  });

  describe("base rulesets on their own", () => {
    it.each([
      ["classic", classic, 6],
      ["starforged", starforged, 12],
    ] as const)("renders every %s collection unchanged", (_label, ruleset, count) => {
      const { maps, rootIds } = buildMaps(ruleset);

      expect(rootIds).toHaveLength(count);
      rootIds.forEach((rootId) => {
        const original = Object.values(ruleset.moves).find(
          (category) => category._id === rootId,
        );
        expect(Object.keys(maps.moveCategoryMap[rootId].contents ?? {})).toEqual(
          Object.keys(original?.contents ?? {}),
        );
      });
    });
  });
});
