import { describe, expect, it } from "vitest";
import { getPageTitle } from "../getPageTitle";

describe("getPageTitle", () => {
  it("names the page, then the app", () => {
    expect(getPageTitle("Kira", "Iron Fellowship for Ironsworn")).toBe(
      "Kira | Iron Fellowship for Ironsworn"
    );
  });

  it("uses the app name alone while the page has no name", () => {
    expect(getPageTitle("", "Crew Link for Starforged")).toBe(
      "Crew Link for Starforged"
    );
    expect(getPageTitle(undefined, "Crew Link for Starforged")).toBe(
      "Crew Link for Starforged"
    );
    expect(getPageTitle("   ", "Crew Link for Starforged")).toBe(
      "Crew Link for Starforged"
    );
  });

  it("trims the page name", () => {
    expect(getPageTitle(" Kira ", "Iron Fellowship")).toBe(
      "Kira | Iron Fellowship"
    );
  });
});
