import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

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

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#ff6584",
    },
    secondary: green,
    darkGrey: {
      light: "#52525b",
      main: "#3f3f46",
      dark: "#27272a",
      contrastText: "#fff",
    },
    success: {
      light: "#10b981",
      main: "#059669",
      dark: "#047857",
    },
    error: {
      light: "#ef4444",
      main: "#dc2626",
      dark: "#b91c1c",
    },
    info: {
      light: "#0ea5e9",
      main: "#0284c7",
      dark: "#0369a1",
    },
    background: {
      paper: "#fff",
      paperInlay: "#f4f4f6",
      paperInlayDarker: "#e4e4e7",
      default: "#e4e4e7",
    },
    grey: {
      [50]: "#fafafa",
      [100]: "#f4f4f6",
      [200]: "#e4e4e7",
      [300]: "#d4d4d8",
      [400]: "#a1a1aa",
      [500]: "#71717a",
      [600]: "#52525b",
      [700]: "#3f3f46",
      [800]: "#27272a",
      [900]: "#18181b",
      A100: "#f4f4f5",
      A200: "#e4e4e7",
      A400: "#a1a1aa",
      A700: "#3f3f46",
    },
  },
  typography: {
    fontFamily: [
      "RubikVariable",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  fontFamilyTitle: [
    "Staatliches",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  shape: {
    borderRadius: 2,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff6584",
    },
    secondary: green,
    darkGrey: {
      light: "#27272a",
      main: "#18181b",
      dark: "#09090b",
      contrastText: "#fff",
    },
    success: {
      light: "#10b981",
      main: "#059669",
      dark: "#047857",
    },
    error: {
      light: "#ef4444",
      main: "#dc2626",
      dark: "#b91c1c",
    },
    info: {
      light: "#0ea5e9",
      main: "#0284c7",
      dark: "#0369a1",
    },
    background: {
      paper: "#27272a",
      paperInlay: "#18181b",
      paperInlayDarker: "#09090b",
      default: "#09090b",
    },
    grey: {
      [50]: "#fafafa",
      [100]: "#f4f4f6",
      [200]: "#e4e4e7",
      [300]: "#d4d4d8",
      [400]: "#a1a1aa",
      [500]: "#71717a",
      [600]: "#52525b",
      [700]: "#3f3f46",
      [800]: "#27272a",
      [900]: "#18181b",
      A100: "#f4f4f5",
      A200: "#e4e4e7",
      A400: "#a1a1aa",
      A700: "#3f3f46",
    },
  },
  typography: {
    fontFamily: [
      "RubikVariable",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  fontFamilyTitle: [
    "Staatliches",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "unset!important", // Remove the annoying elevation background filter
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid #3f3f46`,
          backgroundImage: "unset!important", // Remove the annoying elevation background filter
        },
      },
    },
  },
});
