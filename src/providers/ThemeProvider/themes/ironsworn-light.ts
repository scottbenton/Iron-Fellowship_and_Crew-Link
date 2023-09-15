import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { ironswornGrey, ironswornPink } from "./constants-ironsworn";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";

export const ironswornLightTheme = createTheme({
  palette: {
    primary: ironswornPink,
    secondary: green,
    darkGrey: {
      light: ironswornGrey[600],
      main: ironswornGrey[700],
      dark: ironswornGrey[800],
      contrastText: "#fff",
    },
    ...sharedStatusColors,
    background: {
      paper: "#fff",
      paperInlay: ironswornGrey[100],
      paperInlayDarker: ironswornGrey[200],
      default: ironswornGrey[200],
    },
    grey: ironswornGrey,
  },
  typography: {
    fontFamily: ["RubikVariable", ...baseFontFamilies].join(","),
  },
  fontFamilyTitle: ["Staatliches", ...baseFontFamilies].join(","),
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          "&& .Mui-selected, && .Mui-selected:hover": {
            backgroundColor: ironswornGrey[200],
          },
        },
      },
    },
  },
});
