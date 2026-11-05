import { ThemeConfig, ThemeType } from "./theme.types";
import { MyriadDivider } from "./backgrounds/MyriadDivider";
import { blueGray, myriadTeal, myriadTealLight } from "./constants";
import { MyriadEmptyState } from "./emptyStates/MyriadEmptyState";

export const myriadTheme: ThemeConfig = {
  name: "Myriad",
  iconPath: "/theme/myriad.svg",
  emptyStateImage: <MyriadEmptyState />,
  palette: {
    primary: myriadTeal,
    grey: blueGray,
  },
  borderRadius: 8,
  background: {
    type: "separator",
    node: <MyriadDivider />,
  },
  configs: {
    [ThemeType.Light]: {
      primary: myriadTealLight,
      darkGrey: {
        light: blueGray[600],
        main: blueGray[700],
        dark: blueGray[800],
        contrastText: "#fff",
      },
      background: {
        paper: "#fff",
        paperInlay: blueGray[100],
        paperInlayDarker: blueGray[200],
        default: blueGray[200],
      },
    },
    [ThemeType.Dark]: {
      darkGrey: {
        light: blueGray[800],
        main: blueGray[900],
        dark: blueGray[950],
        contrastText: "#fff",
      },
      background: {
        paper: blueGray[900],
        paperInlay: blueGray[800],
        paperInlayDarker: blueGray[700],
        default: blueGray[950],
      },
    },
  },
};
