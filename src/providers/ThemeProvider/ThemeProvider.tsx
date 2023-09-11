import { PropsWithChildren, useCallback, useState } from "react";
import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { THEME_TYPE, darkTheme, lightTheme } from "./theme";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props;

  const [currentThemeType, setCurrentThemeType] = useState<THEME_TYPE>(
    localStorage.getItem("themeType") === "dark"
      ? THEME_TYPE.DARK
      : THEME_TYPE.LIGHT
  );

  const toggleTheme = useCallback(() => {
    setCurrentThemeType((prevType) => {
      let nextThemeType = THEME_TYPE.DARK;
      if (prevType === THEME_TYPE.DARK) {
        nextThemeType = THEME_TYPE.LIGHT;
      }

      localStorage.setItem("themeType", nextThemeType);

      return nextThemeType;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ themeType: currentThemeType, toggleTheme }}>
      <MuiThemeProvider
        theme={currentThemeType === THEME_TYPE.LIGHT ? lightTheme : darkTheme}
      >
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
