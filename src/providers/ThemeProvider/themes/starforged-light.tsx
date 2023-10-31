import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import { starforgedGold, starforgedGrey } from "./constants-starforged";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";
import { ironswornPink } from "./constants-ironsworn";

export const starforgedLightTheme = createTheme({
  palette: {
    primary: starforgedGold,
    secondary: green,
    darkGrey: {
      light: starforgedGrey[600],
      main: starforgedGrey[700],
      dark: starforgedGrey[800],
      contrastText: "#fff",
    },
    ...sharedStatusColors,
    background: {
      paper: "#fff",
      paperInlay: starforgedGrey[100],
      paperInlayDarker: starforgedGrey[200],
      default: starforgedGrey[200],
    },
    grey: starforgedGrey,
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
            backgroundColor: starforgedGrey[200],
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
        root: ({ ownerState, theme }) => {
          return {
            "&.Mui-focusVisible": {
              boxShadow: `inset 0 0 0 2px ${sharedStatusColors.error.main}, 0 0 0 2px ${sharedStatusColors.error.main}`,
            },
          };
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          "&.Mui-focusVisible": {
            boxShadow: `inset 0 0 0 2px ${sharedStatusColors.error.main}, 0 0 0 2px ${sharedStatusColors.error.main}`,
          },
        }),
      },
    },
  },
});
