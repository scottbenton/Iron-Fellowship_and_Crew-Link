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
    borderRadius: 4,
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
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            "&.Mui-focusVisible": {
              boxShadow: `inset 0 0 0 2px ${theme.palette.info.main}, 0 0 0 2px ${theme.palette.info.main}`,
              "&.dark-focus-outline": {
                boxShadow: `inset 0 0 0 2px ${theme.palette.info.light}, 0 0 0 2px ${theme.palette.info.light}`,
              },
            },
          };
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focusVisible": {
            boxShadow: `inset 0 0 0 2px ${theme.palette.info.main}, 0 0 0 2px ${theme.palette.info.main}`,
            "&.dark-focus-outline": {
              boxShadow: `inset 0 0 0 2px ${theme.palette.info.light}, 0 0 0 2px ${theme.palette.info.light}`,
            },
          },
        }),
      },
    },
  },
});
