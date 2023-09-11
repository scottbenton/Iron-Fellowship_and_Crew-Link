import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useToggleTheme() {
  return useContext(ThemeContext);
}
