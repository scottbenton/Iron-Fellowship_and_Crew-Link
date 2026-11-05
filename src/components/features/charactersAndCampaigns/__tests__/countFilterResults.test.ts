import { describe, expect, it, vi } from "vitest";
import { Datasworn } from "@datasworn-community/core";

vi.mock("stores/store", () => ({ useStore: vi.fn() }));
import {
  CATEGORY_VISIBILITY,
  countVisibleMoves,
} from "../MovesSection/useFilterMoves";
import {
  CATEGORY_VISIBILITY as ORACLE_VISIBILITY,
  CombinedCollectionType,
  countVisibleOracles,
} from "../OracleSection/useFilterOracles";

function withIds<T>(ids: string[], make: (id: string) => T) {
  return Object.fromEntries(ids.map((id) => [id, make(id)]));
}

describe("countVisibleMoves", () => {
  const categories = {
    adventure: {
      _id: "adventure",
      contents: withIds(["face", "secure", "gather"], (id) => ({ _id: id })),
    },
    combat: {
      _id: "combat",
      contents: withIds(["strike", "clash"], (id) => ({ _id: id })),
    },
    fate: { _id: "fate", contents: withIds(["pay"], (id) => ({ _id: id })) },
  } as unknown as Record<string, Datasworn.MoveCategory>;

  it("counts every move in a matching category and matching moves elsewhere", () => {
    expect(
      countVisibleMoves(
        ["adventure", "combat", "fate"],
        categories,
        {
          adventure: CATEGORY_VISIBILITY.SOME,
          combat: CATEGORY_VISIBILITY.ALL,
          fate: CATEGORY_VISIBILITY.HIDDEN,
        },
        { face: true, pay: true }
      )
    ).toBe(3);
  });
});

describe("countVisibleOracles", () => {
  const oracles = withIds(["a", "b", "c", "d"], (id) => ({
    _id: id,
  })) as unknown as Record<string, Datasworn.OracleRollable>;

  const collections = {
    core: {
      _id: "core",
      oracle_type: "tables",
      contents: withIds(["a", "b"], (id) => ({ _id: id })),
      collections: {
        sub: { _id: "sub" },
        shared: { _id: "shared" },
      },
    },
    sub: {
      _id: "sub",
      oracle_type: "tables",
      contents: withIds(["c", "d"], (id) => ({ _id: id })),
    },
    shared: { _id: "shared", oracle_type: "table_shared_text" },
  } as unknown as Record<string, CombinedCollectionType>;

  it("counts shown oracles, nested ones, and a shared table as one", () => {
    expect(
      countVisibleOracles(
        ["core"],
        collections,
        oracles,
        {
          core: ORACLE_VISIBILITY.SOME,
          sub: ORACLE_VISIBILITY.ALL,
          shared: ORACLE_VISIBILITY.ALL,
        },
        { a: true },
        {}
      )
    ).toBe(4);
  });

  it("leaves out oracles the campaign hides", () => {
    expect(
      countVisibleOracles(
        ["core"],
        collections,
        oracles,
        {
          core: ORACLE_VISIBILITY.ALL,
          sub: ORACLE_VISIBILITY.HIDDEN,
          shared: ORACLE_VISIBILITY.HIDDEN,
        },
        {},
        {},
        ["b"]
      )
    ).toBe(1);
  });
});
