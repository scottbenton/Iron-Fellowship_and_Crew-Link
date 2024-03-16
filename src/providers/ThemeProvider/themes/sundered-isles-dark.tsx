import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import {
  sunderedIslesBlue,
  sunderedIslesGrey,
} from "./constants-sunderedIsles";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";

export const sunderedIslesDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: sunderedIslesBlue,
    secondary: green,
    darkGrey: {
      light: sunderedIslesGrey[800],
      main: sunderedIslesGrey[900],
      dark: "#030712",
      contrastText: "#fff",
    },
    ...sharedStatusColors,
    background: {
      paper: sunderedIslesGrey[900],
      paperInlay: sunderedIslesGrey[950],
      paperInlayDarker: sunderedIslesGrey[800],
      default: sunderedIslesGrey[950],
    },
    grey: sunderedIslesGrey,
    divider: sunderedIslesGrey[600],
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
            backgroundColor: sunderedIslesGrey[700],
          },
        },
      },
    },
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
          backgroundImage: "unset!important", // Remove the annoying elevation background filter
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
            color: "#595e68",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            "&.Mui-focusVisible": {
              boxShadow: `inset 0 0 0 2px ${theme.palette.info.light}, 0 0 0 2px ${theme.palette.info.light}`,
            },
          };
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focusVisible": {
            boxShadow: `inset 0 0 0 2px ${theme.palette.info.light}, 0 0 0 2px ${theme.palette.info.light}`,
          },
        }),
      },
    },
  },
});
