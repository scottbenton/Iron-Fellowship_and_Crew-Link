import { Color, Components, PaletteColorOptions, Theme } from "@mui/material";

export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export enum Themes {
  Sunset = "sunset",
  Hinterlands = "hinterlands",
  Eidolon = "eidolon",
  Myriad = "myriad",
}

export interface ThemeConfig {
  name: string;
  iconPath: string;
  emptyStateImage: React.ReactNode;
  background?: {
    type: "separator" | "background";
    node: React.ReactNode;
  };
  palette: {
    primary: PaletteColorOptions;
    grey: Color;
  };
  borderRadius: number;
  configs: Record<ThemeType, ThemeTypeConfig>;
  overrides?: Components<Omit<Theme, "components">>;
}

export interface ThemeTypeConfig {
  /**
   * Replaces `palette.primary` in this mode. Light mode uses it where the
   * theme colour is too light to read as text or icons on white (WCAG 4.5:1).
   */
  primary?: PaletteColorOptions;
  darkGrey: PaletteColorOptions;
  background: {
    paper: string;
    paperInlay: string;
    paperInlayDarker: string;
    default: string;
  };
}

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
    mapBackground: TypeBackground["default"];
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
