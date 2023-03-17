import { useContext } from "react";
import { DieRollContext } from "./DieRollContext";

export function useRoller() {
  return useContext(DieRollContext);
}
