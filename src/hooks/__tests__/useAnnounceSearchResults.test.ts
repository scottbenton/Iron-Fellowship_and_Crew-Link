import { describe, expect, it, vi } from "vitest";

vi.mock("stores/store", () => ({ useStore: vi.fn() }));
import { getSearchResultsText } from "../useAnnounceSearchResults";

describe("getSearchResultsText", () => {
  it("counts results with the right word", () => {
    expect(getSearchResultsText(0, "move", "moves")).toBe("No moves found");
    expect(getSearchResultsText(1, "move", "moves")).toBe("1 move found");
    expect(getSearchResultsText(12, "oracle", "oracles")).toBe(
      "12 oracles found"
    );
  });
});
