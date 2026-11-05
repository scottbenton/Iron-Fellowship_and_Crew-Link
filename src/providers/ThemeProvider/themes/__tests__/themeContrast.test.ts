import { describe, expect, it } from "vitest";
import { getContrastRatio } from "@mui/material";
import { getTheme } from "..";
import { ThemeType, Themes } from "../theme.types";

// The theme colour is used as text and icons (text buttons, tabs, checked
// checkboxes), so in light mode it has to read on white at 4.5:1, and filled
// buttons need their text to read on it.
describe.each(Object.values(Themes))("%s light theme", (themeKey) => {
  const { palette } = getTheme(themeKey, ThemeType.Light);

  it("primary reads on white paper", () => {
    expect(
      getContrastRatio(palette.primary.main, palette.background.paper)
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("filled button text reads on primary", () => {
    expect(
      getContrastRatio(palette.primary.contrastText, palette.primary.main)
    ).toBeGreaterThanOrEqual(4.5);
  });
});
