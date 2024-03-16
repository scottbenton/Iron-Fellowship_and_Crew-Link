import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import { starforgedGold, starforgedGrey } from "./constants-starforged";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";

export const newStarforgedLightTheme = createTheme({
  palette: {
    primary: starforgedGold,
    secondary: green,
    darkGrey: {
      light: starforgedGrey[800],
      main: starforgedGrey[900],
      dark: starforgedGrey[950],
      contrastText: "#fff",
    },
    divider: starforgedGrey[300],
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
