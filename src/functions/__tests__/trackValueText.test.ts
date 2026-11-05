import { describe, it, expect } from "vitest";
import {
  formatSignedValue,
  getClockValueText,
  getExperienceValueText,
  getProgressTrackValueText,
} from "../trackValueText";

describe("formatSignedValue", () => {
  it("adds a plus sign to positive values only", () => {
    expect(formatSignedValue(3)).toBe("+3");
    expect(formatSignedValue(0)).toBe("0");
    expect(formatSignedValue(-2)).toBe("-2");
  });
});

describe("getProgressTrackValueText", () => {
  it("counts whole boxes out of the track's boxes", () => {
    expect(getProgressTrackValueText(0, 40)).toBe("0 of 10 boxes filled");
    expect(getProgressTrackValueText(12, 40)).toBe("3 of 10 boxes filled");
    expect(getProgressTrackValueText(40, 40)).toBe("10 of 10 boxes filled");
  });

  it("adds the ticks in the next box", () => {
    expect(getProgressTrackValueText(1, 40)).toBe(
      "0 of 10 boxes filled, plus 1 tick",
    );
    expect(getProgressTrackValueText(14, 40)).toBe(
      "3 of 10 boxes filled, plus 2 ticks",
    );
  });
});

describe("getClockValueText", () => {
  it("names the clock and its filled segments", () => {
    expect(getClockValueText("Doom", 3, 6)).toBe(
      "Doom, 3 of 6 segments filled",
    );
  });

  it("falls back to Clock without a name", () => {
    expect(getClockValueText(undefined, 0, 4)).toBe(
      "Clock, 0 of 4 segments filled",
    );
  });
});

describe("getExperienceValueText", () => {
  it("gives earned, spent and unspent experience", () => {
    expect(getExperienceValueText(5, 2)).toBe(
      "5 experience earned, 2 spent, 3 unspent",
    );
  });
});
