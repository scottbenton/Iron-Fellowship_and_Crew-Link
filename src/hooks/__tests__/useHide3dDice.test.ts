import { describe, expect, it, vi } from "vitest";

vi.mock("stores/store", () => ({ useStore: vi.fn() }));
import { shouldHide3dDice } from "../useHide3dDice";

describe("shouldHide3dDice", () => {
  it("shows the dice by default", () => {
    expect(shouldHide3dDice(undefined, false, false)).toBe(false);
  });

  it("hides the dice when the device asks to reduce motion", () => {
    expect(shouldHide3dDice(undefined, true, false)).toBe(true);
  });

  it("hides the dice when roll results are read out", () => {
    expect(shouldHide3dDice(undefined, false, true)).toBe(true);
  });

  it("follows the person's own choice over their settings", () => {
    expect(shouldHide3dDice(false, true, true)).toBe(false);
    expect(shouldHide3dDice(true, false, false)).toBe(true);
  });
});
