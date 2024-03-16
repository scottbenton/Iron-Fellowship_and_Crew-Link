import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import { starforgedGold, starforgedGrey } from "./constants-starforged";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";

export const newStarforgedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: starforgedGold,
    secondary: green,
    darkGrey: {
      light: starforgedGrey[900],
      main: starforgedGrey[950],
      dark: "#030712",
      contrastText: "#fff",
    },
    ...sharedStatusColors,
    background: {
      paper: starforgedGrey[900],
      paperInlay: starforgedGrey[950],
      paperInlayDarker: starforgedGrey[800],
      default: starforgedGrey[950],
    },
    grey: starforgedGrey,
    divider: starforgedGrey[600],
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
            backgroundColor: starforgedGrey[700],
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
