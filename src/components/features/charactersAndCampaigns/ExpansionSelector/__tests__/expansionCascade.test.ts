import { describe, expect, it } from "vitest";
import { buildExpansionChanges } from "../expansionCascade";

describe("buildExpansionChanges", () => {
  it("enables lodestar and cascades delve on", () => {
    expect(buildExpansionChanges("lodestar", true)).toEqual({
      lodestar: true,
      delve: true,
    });
  });

  it("disables delve and cascades lodestar off", () => {
    expect(buildExpansionChanges("delve", false)).toEqual({
      delve: false,
      lodestar: false,
    });
  });

  it("enables delve without cascading lodestar", () => {
    expect(buildExpansionChanges("delve", true)).toEqual({ delve: true });
  });

  it("disables lodestar without cascading delve", () => {
    expect(buildExpansionChanges("lodestar", false)).toEqual({
      lodestar: false,
    });
  });

  it("toggles unrelated expansions without side effects", () => {
    expect(buildExpansionChanges("ironsmith", true)).toEqual({
      ironsmith: true,
    });
    expect(buildExpansionChanges("sundered_isles", false)).toEqual({
      sundered_isles: false,
    });
  });
});
