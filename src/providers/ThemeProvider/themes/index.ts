export enum THEME_TYPE {
  LIGHT = "light",
  DARK = "dark",
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
