import { Roll, ROLL_TYPE } from "types/DieRolls.type";
import { OracleTableRollCard } from "./OracleTableRollCard";
import { StatRollCard } from "./StatRollCard";
import { TrackProgressRollCard } from "./TrackProgressRollCard";

export interface RollCardProps {
  roll: Roll;
}

export function RollCard(props: RollCardProps) {
  const { roll } = props;

  switch (roll.type) {
    case ROLL_TYPE.STAT:
      return <StatRollCard roll={roll} />;
    case ROLL_TYPE.ORACLE_TABLE:
      return <OracleTableRollCard roll={roll} />;
    case ROLL_TYPE.TRACK_PROGRESS:
      return <TrackProgressRollCard roll={roll} />;
    default:
      return null;
  }
}
