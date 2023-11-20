import { ROLL_RESULT } from "types/DieRolls.type";

export function getRollResultLabel(result: ROLL_RESULT) {
  switch (result) {
    case ROLL_RESULT.HIT:
      return "Strong Hit";
    case ROLL_RESULT.WEAK_HIT:
      return "Weak Hit";
    case ROLL_RESULT.MISS:
      return "Miss";
  }
}
