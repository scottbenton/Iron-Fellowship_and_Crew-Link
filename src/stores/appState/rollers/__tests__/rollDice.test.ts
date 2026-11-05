import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dice = vi.hoisted(() => ({
  roll: vi.fn(),
  clear: vi.fn(),
  show: vi.fn(),
  hide: vi.fn(),
}));

vi.mock("components/shared/Dice", () => {
  dice.clear.mockImplementation(() => ({ show: dice.show }));
  return { Dice: dice };
});

const groups = [
  { qty: 2, sides: 10, themeColor: "grey" },
  { qty: 1, sides: 6, themeColor: "red" },
];

describe("rollDice", () => {
  beforeEach(() => {
    vi.resetModules();
    dice.roll.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the 3D dice's values when they work", async () => {
    dice.roll.mockResolvedValue([{ value: 3 }, { value: 9 }, { value: 4 }]);
    const { rollDice } = await import("../rollDice");
    await expect(rollDice(groups, true)).resolves.toEqual([3, 9, 4]);
  });

  it("still returns a result when the 3D dice fail, and skips them after", async () => {
    dice.roll.mockRejectedValue(new Error("no WebGL"));
    const { rollDice } = await import("../rollDice");

    const values = await rollDice(groups, true);
    expect(values).toHaveLength(3);
    expect(values[0]).toBeGreaterThanOrEqual(1);
    expect(values[0]).toBeLessThanOrEqual(10);
    expect(values[2]).toBeLessThanOrEqual(6);

    await rollDice(groups, true);
    expect(dice.roll).toHaveBeenCalledTimes(1);
  });

  it("does not wait forever for 3D dice that never settle", async () => {
    vi.useFakeTimers();
    dice.roll.mockReturnValue(new Promise(() => {}));
    const { rollDice } = await import("../rollDice");

    const result = rollDice(groups, true);
    await vi.advanceTimersByTimeAsync(6000);
    await expect(result).resolves.toHaveLength(3);
  });
});
