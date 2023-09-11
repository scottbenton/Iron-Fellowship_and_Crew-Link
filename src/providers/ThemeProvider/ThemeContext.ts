import { createContext } from "react";
import { THEME_TYPE } from "./theme";

export interface IThemeContext {
  themeType: THEME_TYPE;
  toggleTheme: () => void;
}

export const ThemeContext = createContext({
  themeType: THEME_TYPE.LIGHT,
  toggleTheme: () => {},
});
