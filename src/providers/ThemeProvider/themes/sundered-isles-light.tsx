import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import {
  sunderedIslesBlue,
  sunderedIslesGrey,
} from "./constants-sunderedIsles";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";

export const sunderedIslesLightTheme = createTheme({
  palette: {
    primary: sunderedIslesBlue,
    secondary: green,
    darkGrey: {
      light: sunderedIslesGrey[600],
      main: sunderedIslesGrey[700],
      dark: sunderedIslesGrey[800],
      contrastText: "#fff",
    },
    divider: sunderedIslesGrey[300],
    ...sharedStatusColors,
    background: {
      paper: "#fff",
      paperInlay: sunderedIslesGrey[100],
      paperInlayDarker: sunderedIslesGrey[200],
      default: sunderedIslesGrey[200],
    },
    grey: sunderedIslesGrey,
  },
  typography: {
    fontFamily: ["RubikVariable", ...baseFontFamilies].join(","),
  },
  fontFamilyTitle: ["'Bebas Neue'", ...baseFontFamilies].join(","),
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          "&& .Mui-selected, && .Mui-selected:hover": {
            backgroundColor: sunderedIslesGrey[200],
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <HexboxUnchecked />,
        checkedIcon: <HexboxChecked />,
      },
      styleOverrides: {
        root: {
          "&&.Mui-disabled": {
            color: "#bdbdbd",
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
