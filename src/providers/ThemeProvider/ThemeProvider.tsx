import { PropsWithChildren, useCallback, useState } from "react";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material";
import { THEME_TYPE } from "./themes";
import { ThemeContext } from "./ThemeContext";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { useNewCrewLinkTheme } from "hooks/featureFlags/useNewCrewLinkTheme";
import { useNewSunderedIslesTheme } from "hooks/featureFlags/useNewSunderedIslesTheme";
import { starforgedLightTheme } from "./themes/starforged-light";
import { ironswornLightTheme } from "./themes/ironsworn-light";
import { ironswornDarkTheme } from "./themes/ironsworn-dark";
import { starforgedDarkTheme } from "./themes/starforged-dark";
import { newStarforgedLightTheme } from "./themes/new-starforged-light";
import { newStarforgedDarkTheme } from "./themes/new-starforged-dark";
import { sunderedIslesLightTheme } from "./themes/sundered-isles-light";
import { sunderedIslesDarkTheme } from "./themes/sundered-isles-dark";

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  const showNewStarforgedTheme = useNewCrewLinkTheme();
  const showSunderedIslesTheme = useNewSunderedIslesTheme();

  let starforgedTheme: { [key in THEME_TYPE]: Theme } = {
    [THEME_TYPE.LIGHT]: starforgedLightTheme,
    [THEME_TYPE.DARK]: starforgedDarkTheme,
  };
  if (showNewStarforgedTheme) {
    starforgedTheme = {
      [THEME_TYPE.LIGHT]: newStarforgedLightTheme,
      [THEME_TYPE.DARK]: newStarforgedDarkTheme,
    };
  }
  if (showSunderedIslesTheme) {
    starforgedTheme = {
      [THEME_TYPE.LIGHT]: sunderedIslesLightTheme,
      [THEME_TYPE.DARK]: sunderedIslesDarkTheme,
    };
  }

  const gameThemes: GameSystemChooser<{
    [THEME_TYPE.LIGHT]: Theme;
    [THEME_TYPE.DARK]: Theme;
  }> = {
    [GAME_SYSTEMS.IRONSWORN]: {
      [THEME_TYPE.LIGHT]: ironswornLightTheme,
      [THEME_TYPE.DARK]: ironswornDarkTheme,
    },
    [GAME_SYSTEMS.STARFORGED]: starforgedTheme,
  };

  const themes = useGameSystemValue(gameThemes);

  const [currentThemeType, setCurrentThemeType] = useState<THEME_TYPE>(
    localStorage.getItem("themeType") === THEME_TYPE.DARK
      ? THEME_TYPE.DARK
      : THEME_TYPE.LIGHT
  );

  const toggleTheme = useCallback(() => {
    setCurrentThemeType((prevType) => {
      let nextThemeType = THEME_TYPE.DARK;
      if (prevType === THEME_TYPE.DARK) {
        nextThemeType = THEME_TYPE.LIGHT;
      }

      localStorage.setItem("themeType", nextThemeType);

      return nextThemeType;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ themeType: currentThemeType, toggleTheme }}>
      <MuiThemeProvider theme={themes[currentThemeType]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
