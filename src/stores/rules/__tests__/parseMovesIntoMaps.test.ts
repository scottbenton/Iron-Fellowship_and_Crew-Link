import { describe, expect, it, beforeEach } from "vitest";
import { Datasworn, IdParser } from "@datasworn-community/core";
import { parseMovesIntoMaps } from "../helpers/parseMovesIntoMaps";
import { isFullyReplacingMoveCategory } from "../helpers/isFullyReplacingMoveCategory";
import classicJson from "@datasworn-community/ironsworn-classic/json/classic.json";
import delveJson from "@datasworn-community/ironsworn-classic-delve/json/delve.json";
import starforgedJson from "@datasworn-community/starforged/json/starforged.json";
import sunderedIslesJson from "@datasworn-community/sundered-isles/json/sundered_isles.json";
import lodestarJson from "@datasworn-community/ironsworn-classic-lodestar/json/lodestar.json";

const classic = classicJson as unknown as Datasworn.Ruleset;
const delve = delveJson as unknown as Datasworn.Expansion;
const starforged = starforgedJson as unknown as Datasworn.Ruleset;
const sunderedIsles = sunderedIslesJson as unknown as Datasworn.Expansion;
const lodestar = lodestarJson as unknown as Datasworn.Expansion;

/**
 * Parses one package with the given packages visible to the id parser. Merging
 * across packages is rules.slice's job and is covered in rulesContent.test.ts.
 */
function parse(target: Datasworn.RulesPackage, tree: Datasworn.RulesPackage[]) {
  IdParser.tree = Object.fromEntries(tree.map((p) => [p._id, p]));
  return parseMovesIntoMaps(target.moves);
}

function contentIds(category: Datasworn.MoveCategory) {
  return Object.values(category.contents ?? {}).map((move) => move._id);
}

describe("parseMovesIntoMaps", () => {
  beforeEach(() => {
    IdParser.tree = {};
  });

  describe("a move replacing a sibling in the same collection", () => {
    const REVEAL_A_DANGER = "move:delve/delve/reveal_a_danger";
    const REVEAL_A_DANGER_ALT = "move:delve/delve/reveal_a_danger_alt";
    const DELVE_MOVES = "move_category:delve/delve";

    it("drops the replaced move from the collection", () => {
      const maps = parse(delve, [classic, delve]);
      const ids = contentIds(maps.moveCategoryMap[DELVE_MOVES]);

      expect(ids).not.toContain(REVEAL_A_DANGER);
      expect(ids).toContain(REVEAL_A_DANGER_ALT);
    });

    it("keeps every other move in the collection", () => {
      const maps = parse(delve, [classic, delve]);

      expect(contentIds(maps.moveCategoryMap[DELVE_MOVES])).toHaveLength(
        Object.keys(delve.moves.delve.contents ?? {}).length - 1,
      );
    });

    it("still resolves the replaced id to the replacement", () => {
      const maps = parse(delve, [classic, delve]);

      // Links elsewhere still point at the original id.
      expect(maps.moveMap[REVEAL_A_DANGER]._id).toBe(REVEAL_A_DANGER_ALT);
      expect(maps.moveMap[REVEAL_A_DANGER_ALT]._id).toBe(REVEAL_A_DANGER_ALT);
    });
  });

  describe("a move replacing one in another collection", () => {
    it("leaves the replacing collection's own contents alone", () => {
      const maps = parse(sunderedIsles, [starforged, sunderedIsles]);

      // All four Sundered Isles exploration moves replace Starforged ones, and
      // none of them replaces a sibling, so nothing is dropped here.
      expect(
        contentIds(maps.moveCategoryMap["move_category:sundered_isles/exploration"]),
      ).toHaveLength(4);
    });

    it("aliases the replaced id to the replacement", () => {
      const maps = parse(sunderedIsles, [starforged, sunderedIsles]);

      expect(maps.moveMap["move:starforged/exploration/set_a_course"]._id).toBe(
        "move:sundered_isles/exploration/set_a_course",
      );
    });
  });

  describe("packages with no same-collection replacements", () => {
    it.each([
      ["classic", classic],
      ["starforged", starforged],
      ["lodestar", lodestar],
    ] as const)("leaves every %s collection's contents untouched", (_label, pkg) => {
      const maps = parse(pkg, [classic, starforged, pkg]);

      Object.values(pkg.moves).forEach((category) => {
        expect(
          Object.keys(maps.nonReplacedMoveCategoryMap[category._id].contents ?? {}),
        ).toEqual(Object.keys(category.contents ?? {}));
      });
    });
  });
});

describe("isFullyReplacingMoveCategory", () => {
  function knownMoves(...packages: Datasworn.RulesPackage[]) {
    const moves: Record<string, Datasworn.Move> = {};
    packages.forEach((p) =>
      Object.values(p.moves).forEach((category) =>
        Object.values(category.contents ?? {}).forEach((move) => {
          moves[move._id] = move;
        }),
      ),
    );
    return moves;
  }

  it("is true when every move replaces a known move", () => {
    expect(
      isFullyReplacingMoveCategory(
        sunderedIsles.moves.exploration,
        knownMoves(starforged),
      ),
    ).toBe(true);
  });

  it("is false when the replaced moves are not loaded", () => {
    // Sundered Isles without Starforged underneath: nothing to fall back to.
    expect(
      isFullyReplacingMoveCategory(sunderedIsles.moves.exploration, knownMoves(classic)),
    ).toBe(false);
  });

  it("is false when only some moves are replacements", () => {
    expect(
      isFullyReplacingMoveCategory(delve.moves.delve, knownMoves(classic, delve)),
    ).toBe(false);
  });

  it("is false when nothing is a replacement", () => {
    expect(
      isFullyReplacingMoveCategory(
        lodestar.moves.scene_challenge,
        knownMoves(classic, lodestar),
      ),
    ).toBe(false);
  });

  it("is false for an empty collection", () => {
    expect(
      isFullyReplacingMoveCategory(
        { ...delve.moves.delve, contents: {} },
        knownMoves(classic),
      ),
    ).toBe(false);
  });
});
