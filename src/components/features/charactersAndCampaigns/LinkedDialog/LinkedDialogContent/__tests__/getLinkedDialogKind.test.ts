import { describe, expect, it } from "vitest";
import { getLinkedDialogKind } from "../getLinkedDialogKind";

describe("getLinkedDialogKind", () => {
  it.each([
    ["move:classic/fate/ask_the_oracle", "move"],
    ["move:starforged/combat/strike", "move"],
    // Nested in an asset ability - reads as a move, not an asset.
    ["asset.ability.move:starforged/module/shields.0.raise_shields", "move"],
    // Nested in a move - reads as an oracle, not a move.
    ["move.oracle_rollable:delve/delve/delve_the_depths.edge", "oracle"],
    ["move.oracle_rollable:classic/fate/ask_the_oracle.likely", "oracle"],
    ["oracle_rollable:classic/oracles/action_and_theme/action", "oracle"],
    ["oracle_collection:starforged/oracles/core", "oracle"],
    ["asset:starforged/path/empath", "asset"],
    // No dialog renders these, and claiming otherwise sent them to a
    // "Not Found" screen belonging to the wrong type.
    ["move_category:classic/combat", "unsupported"],
    ["asset_collection:starforged/module", "unsupported"],
    ["truth:classic/iron", "unsupported"],
    ["npc:classic/firstborn/elf", "unsupported"],
    ["atlas_entry:classic/ironlands/hinterlands", "unsupported"],
    ["delve_site_domain:delve/barrow", "unsupported"],
  ] as const)("routes %s to the %s dialog", (id, expected) => {
    expect(getLinkedDialogKind(id)).toBe(expected);
  });

  it("does not confuse a move_category with a move", () => {
    expect(getLinkedDialogKind("move_category:delve/delve")).not.toBe("move");
  });

  it("does not confuse an asset_collection with an asset", () => {
    expect(getLinkedDialogKind("asset_collection:classic/path")).not.toBe(
      "asset",
    );
  });
});
