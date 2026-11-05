import { ThemeConfig, ThemeType } from "./theme.types";
import { IronswornDivider } from "./backgrounds/IronswornDivider";
import { hinterlandsGreen, hinterlandsGreenDark, stone } from "./constants";
import { HinterlandsEmptyState } from "./emptyStates/HinterlandsEmptyState";

export const hinterlandsTheme: ThemeConfig = {
  name: "Hinterlands",
  iconPath: "/theme/hinterlands.svg",
  emptyStateImage: <HinterlandsEmptyState />,
  palette: {
    primary: hinterlandsGreen,
    grey: stone,
  },
  borderRadius: 4,
  background: {
    type: "separator",
    node: <IronswornDivider />,
  },
  configs: {
    [ThemeType.Light]: {
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
      primary: hinterlandsGreenDark,
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
