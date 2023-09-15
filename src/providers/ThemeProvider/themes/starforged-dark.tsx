import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import { baseFontFamilies, sharedStatusColors } from "./constants-shared";
import { starforgedGold, starforgedGrey } from "./constants-starforged";
import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { HexboxChecked } from "assets/HexboxChecked";

export const starforgedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: starforgedGold,
    secondary: green,
    darkGrey: {
      light: starforgedGrey[800],
      main: starforgedGrey[900],
      dark: "#030712",
      contrastText: "#fff",
    },
    ...sharedStatusColors,
    background: {
      paper: starforgedGrey[900],
      paperInlay: starforgedGrey[800],
      paperInlayDarker: starforgedGrey[700],
      default: "#030712",
    },
    grey: starforgedGrey,
  },
  typography: {
    fontFamily: ["RubikVariable", ...baseFontFamilies].join(","),
  },
  fontFamilyTitle: ["'Bebas Neue'", ...baseFontFamilies].join(","),
  shape: {
    borderRadius: 2,
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
          border: `1px solid ${starforgedGrey[700]}`,
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
  },
});
