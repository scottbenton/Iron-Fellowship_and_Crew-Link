import { describe, expect, it, vi } from "vitest";
import {
  defaultExpansions,
  findIncludedExpansionConfig,
  loadIncludedExpansion,
  loadIncludedRuleset,
  preloadActiveRuleset,
  thirdPartyExpansions,
} from "../rulesets";

vi.mock("hooks/useGameSystem", () => ({
  getSystem: () => "ironsworn",
}));

describe("ruleset lazy loaders", () => {
  it("loads the active base ruleset on demand", async () => {
    const ruleset = await loadIncludedRuleset();

    expect(ruleset._id).toMatch(/^(classic|starforged)$/);
    expect(Object.keys(ruleset.rules.stats).length).toBeGreaterThan(0);
  });

  it("preloads the active base ruleset at startup", async () => {
    const ruleset = await preloadActiveRuleset();

    expect(ruleset._id).toBe("classic");
    expect(Object.keys(ruleset.rules.stats).length).toBeGreaterThan(0);
  });

  it("can identify included expansions before their data is cached", () => {
    delete defaultExpansions.delve;
    delete thirdPartyExpansions.delve;

    expect(findIncludedExpansionConfig("delve")?.id).toBe("delve");
    expect(defaultExpansions.delve).toBeUndefined();
    expect(thirdPartyExpansions.delve).toBeUndefined();
  });

  it("loads included official expansions into the default expansion cache", async () => {
    delete defaultExpansions.delve;

    const expansion = await loadIncludedExpansion("delve");

    expect(expansion?._id).toBe("delve");
    expect(defaultExpansions.delve?._id).toBe("delve");
  });

  it("loads included third-party expansions into the third-party expansion cache", async () => {
    delete thirdPartyExpansions.ironsmith;

    const expansion = await loadIncludedExpansion("ironsmith");

    expect(expansion?._id).toBe("ironsmith");
    expect(thirdPartyExpansions.ironsmith?._id).toBe("ironsmith");
  });

  it("can identify lodestar as an included expansion before its data is cached", () => {
    delete defaultExpansions.lodestar;

    expect(findIncludedExpansionConfig("lodestar")?.id).toBe("lodestar");
    expect(defaultExpansions.lodestar).toBeUndefined();
  });

  it("loads lodestar into the default expansion cache", async () => {
    delete defaultExpansions.lodestar;

    const expansion = await loadIncludedExpansion("lodestar");

    expect(expansion?._id).toBe("lodestar");
    expect(defaultExpansions.lodestar?._id).toBe("lodestar");
  });
});
