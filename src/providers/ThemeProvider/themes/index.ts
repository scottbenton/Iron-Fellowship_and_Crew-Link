import { Theme } from "@mui/material";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { ironswornLightTheme } from "./ironsworn-light";
import { ironswornDarkTheme } from "./ironsworn-dark";
import { starforgedLightTheme } from "./starforged-light";
import { starforgedDarkTheme } from "./starforged-dark";

export enum THEME_TYPE {
  LIGHT = "light",
  DARK = "dark",
}

export const gameThemes: GameSystemChooser<{
  [THEME_TYPE.LIGHT]: Theme;
  [THEME_TYPE.DARK]: Theme;
}> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    [THEME_TYPE.LIGHT]: ironswornLightTheme,
    [THEME_TYPE.DARK]: ironswornDarkTheme,
  },
  [GAME_SYSTEMS.STARFORGED]: {
    [THEME_TYPE.LIGHT]: starforgedLightTheme,
    [THEME_TYPE.DARK]: starforgedDarkTheme,
  },
};

declare module "@mui/material/styles" {
  interface Theme {
    fontFamilyTitle: string;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    fontFamilyTitle: string;
  }

  interface Palette {
    darkGrey: Palette["primary"];
  }

  interface PaletteOptions {
    darkGrey?: PaletteOptions["primary"];
  }

  interface TypeBackground {
    paperInlay: TypeBackground["default"];
    paperInlayDarker: TypeBackground["default"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    darkGrey: true;
  }
}
declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    darkGrey: true;
  }
}
declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    darkGrey: true;
  }
}
