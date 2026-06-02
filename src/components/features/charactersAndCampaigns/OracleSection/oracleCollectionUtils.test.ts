import { Datasworn } from "@datasworn/core";
import { describe, expect, it } from "vitest";
import { getOracleIdsForCollection } from "./oracleCollectionUtils";

const action: Datasworn.OracleRollable = {
  _id: "oracle_rollable:classic/action",
  type: "oracle_rollable",
  name: "Action",
} as Datasworn.OracleRollable;

const theme: Datasworn.OracleRollable = {
  _id: "oracle_rollable:homebrew/theme",
  type: "oracle_rollable",
  name: "Theme",
} as Datasworn.OracleRollable;

describe("getOracleIdsForCollection", () => {
  it("returns direct oracle and subcollection ids", () => {
    const collection = {
      _id: "oracle_collection:classic/characters",
      type: "oracle_collection",
      name: "Characters",
      oracle_type: "tables",
      contents: { action },
      collections: {
        names: {
          _id: "oracle_collection:classic/characters/names",
          type: "oracle_collection",
          name: "Names",
          oracle_type: "tables",
          contents: {},
          collections: {},
        },
      },
    } as unknown as Datasworn.OracleTablesCollection;

    expect(getOracleIdsForCollection(collection)).toEqual({
      oracleIds: ["oracle_rollable:classic/action"],
      subCollectionIds: ["oracle_collection:classic/characters/names"],
    });
  });

  it("does not append enhancing collection contents after rules merging", () => {
    const collection = {
      _id: "oracle_collection:classic/core",
      type: "oracle_collection",
      name: "Core",
      oracle_type: "tables",
      contents: {
        action,
        theme,
      },
      collections: {},
    } as unknown as Datasworn.OracleTablesCollection;

    expect(getOracleIdsForCollection(collection).oracleIds).toEqual([
      "oracle_rollable:classic/action",
      "oracle_rollable:homebrew/theme",
    ]);
  });
});
