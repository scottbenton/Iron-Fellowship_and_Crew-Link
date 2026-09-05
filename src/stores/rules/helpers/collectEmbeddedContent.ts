import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

type MoveMaps = RulesSliceData["moveMaps"];
type AssetMaps = RulesSliceData["assetMaps"];
type OracleMaps = RulesSliceData["oracleMaps"];

/** Anything that may carry embedded oracle tables: a move, or an asset ability. */
type OracleParent = {
  oracles?: Record<string, Datasworn.EmbeddedOracleRollable>;
};

/**
 * Datasworn nests rollable content inside other content:
 *
 * - a move can carry oracle tables (`move.oracle_rollable:*`), as Delve the
 *   Depths and Ask the Oracle do
 * - an asset ability can carry both oracles and a complete move
 *   (`asset.ability.move:*`), as Shields' Raise Shields does
 *
 * The package parsers only walk the top-level `moves`, `assets` and `oracles`
 * trees, so none of those ids ever reached the lookup maps and every dialog or
 * link pointing at one fell through to "Move Not Found" / "Oracle Not Found".
 *
 * Registering them makes those ids resolve. It does not add them to any list:
 * the moves list renders from moveCategoryMap contents and the oracle list from
 * oracleCollectionMap, and neither gains an entry here.
 */
export function collectEmbeddedContent(
  moveMaps: MoveMaps,
  assetMaps: AssetMaps,
  oracleMaps: OracleMaps
): { moveMaps: MoveMaps; oracleMaps: OracleMaps } {
  const embeddedMoves: Record<string, Datasworn.Move> = {};
  const embeddedOracles: Record<string, Datasworn.OracleRollable> = {};

  const addOracles = (parent: OracleParent, source: Datasworn.SourceInfo) => {
    Object.values(parent.oracles ?? {}).forEach((oracle) => {
      embeddedOracles[oracle._id] = withSource(oracle, source);
    });
  };

  Object.values(moveMaps.moveMap).forEach((move) => {
    addOracles(move as OracleParent, move._source);
  });

  Object.values(assetMaps.assetMap).forEach((asset) => {
    asset.abilities.forEach((ability) => {
      addOracles(ability as OracleParent, asset._source);

      Object.values(ability.moves ?? {}).forEach((move) => {
        embeddedMoves[move._id] = withSource(move, asset._source);
        addOracles(move as OracleParent, asset._source);
      });
    });
  });

  if (
    Object.keys(embeddedMoves).length === 0 &&
    Object.keys(embeddedOracles).length === 0
  ) {
    return { moveMaps, oracleMaps };
  }

  return {
    moveMaps: {
      ...moveMaps,
      // Embedded moves never override a top-level move of the same id.
      moveMap: { ...embeddedMoves, ...moveMaps.moveMap },
    },
    oracleMaps: {
      ...oracleMaps,
      allOraclesMap: { ...embeddedOracles, ...oracleMaps.allOraclesMap },
      oracleRollableMap: {
        ...embeddedOracles,
        ...oracleMaps.oracleRollableMap,
      },
    },
  };
}

/**
 * Embedded content omits `_source` because it inherits its parent's. Consumers
 * are typed against the top-level shapes, so put the parent's source back.
 */
function withSource<R>(embedded: object, source: Datasworn.SourceInfo): R {
  return { _source: source, ...embedded } as unknown as R;
}
