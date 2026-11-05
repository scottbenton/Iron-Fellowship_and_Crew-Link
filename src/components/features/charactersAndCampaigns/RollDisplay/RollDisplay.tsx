import { Box, Card, Divider, IconButton, Typography } from "@mui/material";
import DismissIcon from "@mui/icons-material/Close";
import { ROLL_TYPE, Roll } from "types/DieRolls.type";
import { RollTitle } from "./RollTitle";
import { RollValues } from "./RollValues";
import { RollResult } from "./RollResult";
import { getRollResultLabel } from "./getRollResultLabel";
import { RollContainer } from "./RollContainer";
import { ReactNode, Ref } from "react";
import { useStore } from "stores/store";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { ScreenReaderOnly } from "components/shared/ScreenReaderOnly";
import { getRollDescription, getRollTitle } from "functions/rollText";

export interface RollDisplayProps {
  roll: Roll;
  isExpanded: boolean;
  actions?: ReactNode;
  // Shows a Dismiss button, which calls this.
  onDismiss?: () => void;
  dismissButtonRef?: Ref<HTMLButtonElement>;
  // Read by screen readers before and after the description of the roll,
  // such as who rolled it and when.
  descriptionPrefix?: string;
  descriptionSuffix?: string;
}

// Room kept beside the title for each icon button in the top corner.
const BUTTON_SIZE = 40;

export function RollDisplay(props: RollDisplayProps) {
  const {
    roll,
    isExpanded,
    actions,
    onDismiss,
    dismissButtonRef,
    descriptionPrefix,
    descriptionSuffix,
  } = props;

  const oracles = useStore((store) => store.rules.oracleMaps.oracleRollableMap);

  const isOracleMatch =
    roll.type === ROLL_TYPE.ORACLE_TABLE &&
    !!roll.oracleId &&
    !!oracles[roll.oracleId]?.match &&
    !Array.isArray(roll.roll) &&
    checkIfMatch(roll.roll);

  // The copy and more buttons, shown on an expanded card, then Dismiss.
  const reservedButtonSpace =
    ((isExpanded ? 2 : 0) + (onDismiss ? 1 : 0)) * BUTTON_SIZE;

  return (
    <Card
      sx={(theme) => ({
        backgroundColor: theme.palette.darkGrey.dark,
        color: theme.palette.darkGrey.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
      })}
    >
      {/* The dice, totals and icons below are drawn for the eye. Screen
          readers get the whole roll as sentences instead. */}
      <ScreenReaderOnly>
        {[
          descriptionPrefix,
          getRollDescription(roll, { oracleMatch: isOracleMatch }),
          descriptionSuffix,
        ]
          .filter(Boolean)
          .join(" ")}
      </ScreenReaderOnly>
      <Box px={2} py={1} aria-hidden>
        {roll.type === ROLL_TYPE.STAT && (
          <>
            <RollTitle
              title={roll.moveName ? roll.moveName : roll.rollLabel}
              overline={roll.moveName ? roll.rollLabel : undefined}
              isExpanded={isExpanded}
              reservedSpace={reservedButtonSpace}
            />
            <RollContainer>
              <RollValues
                d6Result={{
                  action: roll.action,
                  modifier: roll.modifier,
                  adds: roll.adds,
                  rollTotal:
                    (roll.matchedNegativeMomentum ? 0 : roll.action) +
                    (roll.modifier ?? 0) +
                    (roll.adds ?? 0),
                }}
                crossOutD6={!!roll.momentumBurned}
                crossOutD6Value={roll.matchedNegativeMomentum}
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
                  ...(roll.matchedNegativeMomentum
                    ? ["Matched negative momentum"]
                    : []),
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
              reservedSpace={reservedButtonSpace}
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
              reservedSpace={reservedButtonSpace}
            />
            <RollContainer>
              <RollValues d10Results={roll.roll} isExpanded={isExpanded} />
              <RollResult
                markdown={roll.result}
                extras={isOracleMatch ? ["Match"] : undefined}
              />
            </RollContainer>
            {isExpanded && roll.text2 && (
              <MarkdownRenderer
                disableLinks
                markdown={roll.text2}
                inheritColor
              />
            )}
            {isExpanded && roll.text3 && (
              <MarkdownRenderer
                disableLinks
                markdown={roll.text3}
                inheritColor
              />
            )}
          </>
        )}
        {roll.type === ROLL_TYPE.CLOCK_PROGRESSION && (
          <>
            <RollTitle
              overline={roll.oracleTitle}
              title={roll.rollLabel}
              isExpanded={isExpanded}
              reservedSpace={reservedButtonSpace}
            />
            <RollContainer>
              <RollValues d10Results={roll.roll} isExpanded={isExpanded} />
              <RollResult
                markdown={roll.result}
                extras={roll.match ? ["Match"] : undefined}
              />
            </RollContainer>
          </>
        )}
        {roll.type === ROLL_TYPE.CUSTOM_DICE && (
          <>
            <RollTitle
              title={roll.notation}
              isExpanded={isExpanded}
              reservedSpace={reservedButtonSpace}
            />
            <RollContainer>
              {isExpanded && (
                <>
                  <Box>
                    <Typography
                      variant="body2"
                      color={(theme) => theme.palette.grey[200]}
                    >
                      {roll.dieValues.join(", ")}
                    </Typography>
                    {roll.modifier !== 0 && (
                      <Typography
                        variant="body2"
                        color={(theme) => theme.palette.grey[200]}
                      >
                        {roll.modifier > 0 ? "+" : ""}
                        {roll.modifier}
                      </Typography>
                    )}
                  </Box>
                  <Divider
                    orientation="vertical"
                    sx={(theme) => ({
                      alignSelf: "stretch",
                      borderColor: theme.palette.grey[400],
                      height: "auto",
                      mx: 2,
                    })}
                  />
                </>
              )}
              <RollResult result={String(roll.total)} />
            </RollContainer>
          </>
        )}
      </Box>
      <Box position={"absolute"} top={0} right={0}>
        {isExpanded && actions}
        {onDismiss && (
          <IconButton
            aria-label={`Dismiss ${getRollTitle(roll)} roll`}
            color={"inherit"}
            onClick={onDismiss}
            ref={dismissButtonRef}
          >
            <DismissIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
}
// A bit hacky, check if the last two digits of the number are equal to each other.
function checkIfMatch(num: number) {
  return num % 10 === Math.floor(num / 10) % 10;
}
