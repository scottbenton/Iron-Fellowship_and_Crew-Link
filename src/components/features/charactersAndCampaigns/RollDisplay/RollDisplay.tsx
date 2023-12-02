import { Box, Card, CardActionArea } from "@mui/material";
import { ROLL_TYPE, Roll } from "types/DieRolls.type";
import { RollTitle } from "./RollTitle";
import { RollValues } from "./RollValues";
import { RollResult } from "./RollResult";
import { getRollResultLabel } from "./getRollResultLabel";
import { RollContainer } from "./RollContainer";
import { ReactNode } from "react";

export interface RollDisplayProps {
  roll: Roll;
  onClick?: () => void;
  isExpanded: boolean;
  actions?: ReactNode;
}

export function RollDisplay(props: RollDisplayProps) {
  const { roll, onClick, isExpanded, actions } = props;

  return (
    <Card
      sx={(theme) => ({
        backgroundColor: theme.palette.darkGrey.dark,
        color: theme.palette.darkGrey.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      })}
    >
      <Box
        component={onClick ? CardActionArea : "div"}
        onClick={onClick ? onClick : undefined}
        px={2}
        py={1}
      >
        {roll.type === ROLL_TYPE.STAT && (
          <>
            <RollTitle
              title={roll.moveName ? roll.moveName : roll.rollLabel}
              overline={roll.moveName ? roll.rollLabel : undefined}
              isExpanded={isExpanded}
              actions={actions}
            />
            <RollContainer>
              <RollValues
                d6Result={{
                  action: roll.action,
                  modifier: roll.modifier,
                  adds: roll.adds,
                  rollTotal:
                    roll.action + (roll.modifier ?? 0) + (roll.adds ?? 0),
                }}
                crossOutD6={!!roll.momentumBurned}
                d10Results={[roll.challenge1, roll.challenge2]}
                fixedResult={
                  roll.momentumBurned
                    ? { title: "Momentum", value: roll.momentumBurned }
                    : undefined
                }
                isExpanded={isExpanded}
              />
              <RollResult
                result={getRollResultLabel(roll.result)}
                extras={[
                  ...(roll.challenge1 === roll.challenge2 ? ["Match"] : []),
                  ...(roll.action === 1 ? ["One on the action die"] : []),
                ]}
              />
            </RollContainer>
          </>
        )}
        {roll.type === ROLL_TYPE.TRACK_PROGRESS && (
          <>
            <RollTitle
              title={roll.rollLabel}
              isExpanded={isExpanded}
              actions={actions}
            />
            <RollContainer>
              <RollValues
                fixedResult={{
                  title: "Progress",
                  value: roll.trackProgress,
                }}
                d10Results={[roll.challenge1, roll.challenge2]}
                isExpanded={isExpanded}
              />
              <RollResult
                result={getRollResultLabel(roll.result)}
                extras={[
                  ...(roll.challenge1 === roll.challenge2 ? ["Doubles"] : []),
                ]}
              />
            </RollContainer>
          </>
        )}
        {roll.type === ROLL_TYPE.ORACLE_TABLE && (
          <>
            <RollTitle
              overline={roll.oracleCategoryName}
              title={roll.rollLabel}
              isExpanded={isExpanded}
              actions={actions}
            />
            <RollContainer>
              <RollValues d10Results={roll.roll} isExpanded={isExpanded} />
              <RollResult markdown={roll.result} />
            </RollContainer>
          </>
        )}
        {roll.type === ROLL_TYPE.CLOCK_PROGRESSION && (
          <>
            <RollTitle
              overline={roll.oracleTitle}
              title={roll.rollLabel}
              isExpanded={isExpanded}
              actions={actions}
            />
            <RollContainer>
              <RollValues d10Results={roll.roll} isExpanded={isExpanded} />
              <RollResult markdown={roll.result} />
            </RollContainer>
          </>
        )}
      </Box>
    </Card>
  );
}
