import { describe, expect, it } from "vitest";
import { Datasworn, IdParser } from "@datasworn/core";
import { parseMovesIntoMaps } from "../helpers/parseMovesIntoMaps";
import { parseAssetsIntoMaps } from "../helpers/parseAssetsIntoMaps";
import { parseOraclesIntoMaps } from "../helpers/parseOraclesIntoMaps";
import { collectEmbeddedContent } from "../helpers/collectEmbeddedContent";
import classicJson from "@datasworn/ironsworn-classic/json/classic.json";
import delveJson from "@datasworn/ironsworn-classic-delve/json/delve.json";
import starforgedJson from "@datasworn/starforged/json/starforged.json";

const classic = classicJson as unknown as Datasworn.Ruleset;
const delve = delveJson as unknown as Datasworn.Expansion;
const starforged = starforgedJson as unknown as Datasworn.Ruleset;

function build(packages: Datasworn.RulesPackage[]) {
  const tree: Record<string, Datasworn.RulesPackage> = {};
  packages.forEach((p) => (tree[p._id] = p));
  IdParser.tree = tree;

  let moveMaps = parseMovesIntoMaps({});
  let assetMaps = parseAssetsIntoMaps({});
  let oracleMaps = parseOraclesIntoMaps({});

  packages.forEach((p) => {
    const m = parseMovesIntoMaps(p.moves);
    const a = parseAssetsIntoMaps(p.assets);
    const o = parseOraclesIntoMaps(p.oracles);
    moveMaps = {
      moveCategoryMap: { ...moveMaps.moveCategoryMap, ...m.moveCategoryMap },
      nonReplacedMoveCategoryMap: {
        ...moveMaps.nonReplacedMoveCategoryMap,
        ...m.nonReplacedMoveCategoryMap,
      },
      moveMap: { ...moveMaps.moveMap, ...m.moveMap },
      nonReplacedMoveMap: {
        ...moveMaps.nonReplacedMoveMap,
        ...m.nonReplacedMoveMap,
      },
    };
    assetMaps = {
      assetCollectionMap: {
        ...assetMaps.assetCollectionMap,
        ...a.assetCollectionMap,
      },
      nonReplacedAssetCollectionMap: {
        ...assetMaps.nonReplacedAssetCollectionMap,
        ...a.nonReplacedAssetCollectionMap,
      },
      assetMap: { ...assetMaps.assetMap, ...a.assetMap },
    };
    oracleMaps = {
      ...oracleMaps,
      allOraclesMap: { ...oracleMaps.allOraclesMap, ...o.allOraclesMap },
      oracleRollableMap: {
        ...oracleMaps.oracleRollableMap,
        ...o.oracleRollableMap,
      },
      oracleCollectionMap: {
        ...oracleMaps.oracleCollectionMap,
        ...o.oracleCollectionMap,
      },
    };
  });

  const before = { moveMaps, assetMaps, oracleMaps };
  const after = collectEmbeddedContent(moveMaps, assetMaps, oracleMaps);
  return { before, after };
}

describe("collectEmbeddedContent", () => {
  describe("oracles embedded in a move", () => {
    it("registers each of Delve the Depths' stat tables", () => {
      const { after } = build([classic, delve]);

      ["edge", "shadow", "wits"].forEach((stat) => {
        const id = `move.oracle_rollable:delve/delve/delve_the_depths.${stat}`;
        expect(after.oracleMaps.allOraclesMap[id]).toBeDefined();
        expect(after.oracleMaps.oracleRollableMap[id].rows).toHaveLength(5);
      });
    });

    it("registers Ask the Oracle's odds tables", () => {
      const { after } = build([classic]);

      expect(
        after.oracleMaps.oracleRollableMap[
          "move.oracle_rollable:classic/fate/ask_the_oracle.likely"
        ],
      ).toBeDefined();
    });
  });

  describe("content embedded in an asset ability", () => {
    it("registers Raise Shields as a resolvable move", () => {
      const { after } = build([starforged]);
      const move =
        after.moveMaps.moveMap[
          "asset.ability.move:starforged/module/shields.0.raise_shields"
        ];

      expect(move?.name).toBe("Raise Shields");
      expect(move.roll_type).toBe("action_roll");
    });

    it("registers every shipped Starforged ability move", () => {
      const { after } = build([starforged]);
      const embedded = Object.keys(after.moveMaps.moveMap).filter((id) =>
        id.startsWith("asset.ability.move:"),
      );

      expect(embedded).toHaveLength(12);
    });

    it("inherits the parent asset's source", () => {
      const { before, after } = build([starforged]);
      const move =
        after.moveMaps.moveMap[
          "asset.ability.move:starforged/module/shields.0.raise_shields"
        ];

      expect(move._source).toEqual(
        before.assetMaps.assetMap["asset:starforged/module/shields"]._source,
      );
    });
  });

  describe("does not disturb top-level content", () => {
    it("leaves the rendered move and oracle lists untouched", () => {
      const { before, after } = build([classic, delve]);

      expect(after.moveMaps.moveCategoryMap).toBe(
        before.moveMaps.moveCategoryMap,
      );
      expect(after.oracleMaps.oracleCollectionMap).toBe(
        before.oracleMaps.oracleCollectionMap,
      );
    });

    it("never overrides a top-level move of the same id", () => {
      const { before, after } = build([classic, delve]);

      Object.keys(before.moveMaps.moveMap).forEach((id) => {
        expect(after.moveMaps.moveMap[id]).toBe(before.moveMaps.moveMap[id]);
      });
    });

    it("is a no-op for a package with nothing embedded", () => {
      const empty = {
        _id: "empty",
        moves: {},
        assets: {},
        oracles: {},
      } as unknown as Datasworn.RulesPackage;
      const { before, after } = build([empty]);

      expect(after.moveMaps).toBe(before.moveMaps);
      expect(after.oracleMaps).toBe(before.oracleMaps);
    });
  });
});
