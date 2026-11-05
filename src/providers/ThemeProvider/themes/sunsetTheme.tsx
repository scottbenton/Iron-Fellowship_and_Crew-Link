import { ThemeConfig, ThemeType } from "./theme.types";
import { IronswornDivider } from "./backgrounds/IronswornDivider";
import { stone, sunsetPink, sunsetPinkLight } from "./constants";
import { SunsetEmptyState } from "./emptyStates/SunsetEmptyState";

export const sunsetTheme: ThemeConfig = {
  name: "Sunset",
  iconPath: "/theme/sunset.svg",
  emptyStateImage: <SunsetEmptyState />,
  palette: {
    primary: sunsetPink,
    grey: stone,
  },
  borderRadius: 4,
  background: {
    type: "separator",
    node: <IronswornDivider />,
  },
  configs: {
    [ThemeType.Light]: {
      primary: sunsetPinkLight,
      darkGrey: {
        light: stone[600],
        main: stone[700],
        dark: stone[800],
        contrastText: "#fff",
      },
      background: {
        paper: "#fff",
        paperInlay: stone[100],
        paperInlayDarker: stone[200],
        default: stone[200],
      },
    },
    [ThemeType.Dark]: {
      darkGrey: {
        light: stone[800],
        main: stone[900],
        dark: stone[950],
        contrastText: "#fff",
      },
      background: {
        paper: stone[900],
        paperInlay: stone[800],
        paperInlayDarker: stone[700],
        default: stone[950],
      },
    },
  },
};
