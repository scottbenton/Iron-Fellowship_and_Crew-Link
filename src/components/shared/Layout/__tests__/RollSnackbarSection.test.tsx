/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material";
import { ROLL_RESULT, ROLL_TYPE, Roll } from "types/DieRolls.type";

const clearRoll = vi.fn();
const clearRolls = vi.fn();

const rolls: Record<string, Roll> = {
  older: {
    type: ROLL_TYPE.CUSTOM_DICE,
    rollLabel: "1d6",
    notation: "1d6",
    dieSides: 6,
    dieValues: [4],
    modifier: 0,
    total: 4,
    timestamp: new Date(1),
    characterId: null,
    uid: "uid",
    gmsOnly: false,
  },
  newer: {
    type: ROLL_TYPE.STAT,
    rollLabel: "Edge",
    moveName: "Face Danger",
    action: 5,
    modifier: 2,
    challenge1: 3,
    challenge2: 9,
    result: ROLL_RESULT.WEAK_HIT,
    timestamp: new Date(2),
    characterId: null,
    uid: "uid",
    gmsOnly: false,
  },
};

const state = {
  appState: { rolls, clearRoll, clearRolls },
  rules: { oracleMaps: { oracleRollableMap: {} } },
};

vi.mock("stores/store", () => ({
  useStore: (selector: (store: typeof state) => unknown) => selector(state),
}));
vi.mock("hooks/useFooterState", () => ({
  useFooterState: () => ({ isFooterVisible: false, footerHeight: 0 }),
}));
vi.mock(
  "components/features/charactersAndCampaigns/RollDisplay/NormalRollActions",
  () => ({ NormalRollActions: () => null })
);

import { RollSnackbarSection } from "../RollSnackbarSection";

const grey = {
  light: "#666",
  main: "#444",
  dark: "#222",
  contrastText: "#fff",
};
const theme = createTheme({
  palette: { darkGrey: grey },
  fontFamilyTitle: "serif",
});

(
  globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("RollSnackbarSection", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    vi.clearAllMocks();
  });

  function render() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root?.render(
        <ThemeProvider theme={theme}>
          <RollSnackbarSection />
        </ThemeProvider>
      );
    });
    return container;
  }

  it("lists each roll as readable text with a named Dismiss button", () => {
    const view = render();

    const region = view.querySelector("section");
    expect(region?.getAttribute("aria-label")).toBe("Recent rolls");

    const items = view.querySelectorAll("section > ul > li");
    expect(items).toHaveLength(2);
    expect(items[1].textContent).toContain(
      "Face Danger, using Edge. Action die 5 plus 2, total 7. Challenge dice 3 and 9. Weak Hit."
    );
    expect(items[1].querySelector("[aria-hidden='true']")).not.toBeNull();

    const dismissNames = Array.from(
      view.querySelectorAll("section button[aria-label]")
    ).map((button) => button.getAttribute("aria-label"));
    expect(dismissNames).toEqual([
      "Dismiss 1d6 roll",
      "Dismiss Face Danger roll",
    ]);
  });

  it("dismisses only through the button and keeps focus on a card", () => {
    const view = render();
    const [olderButton, newerButton] = Array.from(
      view.querySelectorAll<HTMLButtonElement>("section button[aria-label]")
    );

    act(() => {
      newerButton.focus();
      newerButton.click();
    });

    expect(clearRoll).toHaveBeenCalledWith("newer");
    expect(document.activeElement).toBe(olderButton);
  });
});
