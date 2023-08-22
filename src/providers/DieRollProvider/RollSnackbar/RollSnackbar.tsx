import { Roll, ROLL_TYPE } from "types/DieRolls.type";
import { OracleTableRollSnackbar } from "./OracleTableRollSnackbar";
import { StatRollSnackbar } from "./StatRollSnackbar";
import { TrackProgressRollSnackbar } from "./TrackProgressRollSnackbar";

export interface RollSnackbarProps {
  roll: Roll;
  clearRoll?: () => void;
  isExpanded: boolean;
}

export function RollSnackbar(props: RollSnackbarProps) {
  const { roll, clearRoll, isExpanded } = props;

  switch (roll.type) {
    case ROLL_TYPE.STAT:
      return (
        <StatRollSnackbar
          roll={roll}
          clearRoll={clearRoll}
          expanded={isExpanded}
        />
      );
    case ROLL_TYPE.ORACLE_TABLE:
      return (
        <OracleTableRollSnackbar
          roll={roll}
          clearRoll={clearRoll}
          expanded={isExpanded}
        />
      );
    case ROLL_TYPE.TRACK_PROGRESS:
      return (
        <TrackProgressRollSnackbar
          roll={roll}
          clearRoll={clearRoll}
          expanded={isExpanded}
        />
      );
    default:
      return null;
  }
}
