import { describe, expect, it } from "vitest";
import {
  CATEGORY_VISIBILITY,
  filterDataswornCollections,
} from "../useDataswornCollectionFilter";

interface TestItem {
  _id: string;
  name: string;
}

interface TestCollection {
  _id: string;
  name: string;
  contents?: Record<string, TestItem>;
  collections?: Record<string, TestCollection>;
  enhances?: string[];
}

const strike: TestItem = {
  _id: "move:classic/combat/strike",
  name: "Strike",
};

const customMove: TestItem = {
  _id: "move:homebrew/combat/custom",
  name: "Custom Move",
};

function filter(
  collections: Record<string, TestCollection>,
  search: string,
) {
  return filterDataswornCollections({
    collections,
    rootCollectionIds: Object.keys(collections),
    search,
    getSubCollections: (collection) =>
      Object.values(collection.collections ?? {}),
  });
}

describe("filterDataswornCollections", () => {
  it("marks populated collections visible when search is empty", () => {
    const result = filter(
      {
        combat: {
          _id: "move_category:classic/combat",
          name: "Combat",
          contents: { strike },
        },
      },
      "",
    );

    expect(result.isEmpty).toBe(false);
    expect(result.visibleCollectionIds["move_category:classic/combat"]).toBe(
      CATEGORY_VISIBILITY.ALL,
    );
  });

  it("marks a collection ALL when the collection name matches", () => {
    const result = filter(
      {
        combat: {
          _id: "move_category:classic/combat",
          name: "Combat",
          contents: { strike },
        },
      },
      "combat",
    );

    expect(result.visibleCollectionIds["move_category:classic/combat"]).toBe(
      CATEGORY_VISIBILITY.ALL,
    );
    expect(result.visibleItemIds).toEqual({});
  });

  it("marks a collection SOME and the item visible when only an item matches", () => {
    const result = filter(
      {
        combat: {
          _id: "move_category:classic/combat",
          name: "Combat",
          contents: { strike },
        },
      },
      "strike",
    );

    expect(result.visibleCollectionIds["move_category:classic/combat"]).toBe(
      CATEGORY_VISIBILITY.SOME,
    );
    expect(result.visibleItemIds["move:classic/combat/strike"]).toBe(true);
  });

  it("bubbles nested collection matches up to the parent collection", () => {
    const result = filter(
      {
        characters: {
          _id: "oracle_collection:classic/characters",
          name: "Characters",
          collections: {
            names: {
              _id: "oracle_collection:classic/characters/names",
              name: "Names",
              contents: {
                given: {
                  _id: "oracle_rollable:classic/characters/names/given",
                  name: "Given Name",
                },
              },
            },
          },
        },
      },
      "given",
    );

    expect(
      result.visibleCollectionIds["oracle_collection:classic/characters"],
    ).toBe(CATEGORY_VISIBILITY.SOME);
    expect(
      result.visibleCollectionIds["oracle_collection:classic/characters/names"],
    ).toBe(CATEGORY_VISIBILITY.SOME);
    expect(
      result.visibleItemIds["oracle_rollable:classic/characters/names/given"],
    ).toBe(true);
  });

  it("does not append enhancing collection contents during filtering", () => {
    const result = filter(
      {
        combat: {
          _id: "move_category:classic/combat",
          name: "Combat",
          contents: {
            strike,
            custom: customMove,
          },
        },
        homebrewCombat: {
          _id: "move_category:homebrew/combat",
          name: "Homebrew Combat",
          enhances: ["move_category:classic/combat"],
          contents: {
            custom: customMove,
          },
        },
      },
      "custom",
    );

    expect(result.visibleItemIds).toEqual({
      "move:homebrew/combat/custom": true,
    });
  });

  it("reports empty when no collections or items match", () => {
    const result = filter(
      {
        combat: {
          _id: "move_category:classic/combat",
          name: "Combat",
          contents: { strike },
        },
      },
      "supply",
    );

    expect(result.isEmpty).toBe(true);
    expect(result.visibleCollectionIds["move_category:classic/combat"]).toBe(
      CATEGORY_VISIBILITY.HIDDEN,
    );
  });
});
