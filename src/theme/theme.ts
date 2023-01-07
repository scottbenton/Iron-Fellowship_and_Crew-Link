import { colors, createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#343a40",
    },
    secondary: {
      light: "#facc15",
      main: "#eab308",
      dark: "#ca8a04",
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
});
