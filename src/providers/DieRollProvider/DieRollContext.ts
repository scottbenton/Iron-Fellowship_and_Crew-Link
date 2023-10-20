import { createContext } from "react";
import { ROLL_RESULT, Roll } from "types/DieRolls.type";
import { TRACK_TYPES } from "types/Track.type";

export interface IDieRollContext {
  rolls: Roll[];
  rollStat: (
    rollLabel: string,
    modifier: number,
    adds?: number,
    showSnackbar?: boolean
  ) => ROLL_RESULT;
  rollOracleTable: (
    oracleId: string,
    showSnackbar?: boolean,
    gmsOnly?: boolean
  ) => string | undefined;
  rollTrackProgress: (
    trackType: TRACK_TYPES,
    trackTitle: string,
    trackProgress: number
  ) => ROLL_RESULT;
  rollClockProgression: (clockTitle: string, oracleId: string) => boolean;
}

export const DieRollContext = createContext<IDieRollContext>({
  rolls: [],
  rollStat: () => ROLL_RESULT.MISS,
  rollOracleTable: () => "",
  rollTrackProgress: () => ROLL_RESULT.MISS,
  rollClockProgression: () => false,
});
