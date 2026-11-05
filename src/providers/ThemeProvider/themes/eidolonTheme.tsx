import { HexboxUnchecked } from "assets/HexboxUnchecked";
import { ThemeConfig, ThemeType } from "./theme.types";
import { EidolonBackground } from "./backgrounds/EidolonBackground";
import { slate, eidolonGold, eidolonGoldLight } from "./constants";
import { EidolonEmptyState } from "./emptyStates/EidolonEmptyState";
import { HexboxChecked } from "assets/HexboxChecked";

export const eidolonTheme: ThemeConfig = {
  name: "Eidolon",
  iconPath: "/theme/eidolon.svg",
  emptyStateImage: <EidolonEmptyState />,
  palette: {
    primary: eidolonGold,
    grey: slate,
  },
  borderRadius: 8,
  background: {
    type: "background",
    node: <EidolonBackground />,
  },
  configs: {
    [ThemeType.Light]: {
      primary: eidolonGoldLight,
      darkGrey: {
        light: slate[800],
        main: slate[900],
        dark: slate[950],
        contrastText: "#fff",
      },
      background: {
        paper: "#fff",
        paperInlay: slate[100],
        paperInlayDarker: slate[200],
        default: slate[200],
      },
    },
    [ThemeType.Dark]: {
      darkGrey: {
        light: slate[800],
        main: slate[900],
        dark: slate[950],
        contrastText: "#fff",
      },
      background: {
        paper: slate[900],
        paperInlay: slate[950],
        paperInlayDarker: slate[800],
        default: slate[950],
      },
    },
  },
  overrides: {
    MuiRadio: {
      defaultProps: {
        icon: <HexboxUnchecked />,
        checkedIcon: <HexboxChecked />,
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
  },
};
