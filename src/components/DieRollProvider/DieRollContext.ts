import { createContext } from "react";

export enum ROLL_RESULT {
  HIT,
  WEAK_HIT,
  MISS,
}
export interface Roll {
  action: number;
  challenge1: number;
  challenge2: number;
  rollLabel: string;
  modifier?: number;
  result: ROLL_RESULT;
  timestamp: Date;
}

export interface IDieRollContext {
  rolls: Roll[];
  roll: (rollLabel: string, modifier?: number) => ROLL_RESULT;
}

export const DieRollContext = createContext<IDieRollContext>({
  rolls: [],
  roll: () => ROLL_RESULT.MISS,
});
