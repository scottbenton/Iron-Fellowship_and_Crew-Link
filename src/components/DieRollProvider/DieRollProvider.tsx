import {
  Box,
  ButtonBase,
  Card,
  Divider,
  Fab,
  Slide,
  Typography,
  useTheme,
} from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { DieRollContext, Roll, ROLL_RESULT } from "./DieRollContext";
import { TransitionGroup } from "react-transition-group";
import { ReactComponent as D10Icon } from "../../assets/d10.svg";
import { ReactComponent as D6Icon } from "../../assets/d6.svg";
import ClearIcon from "@mui/icons-material/Close";

const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};
const getRollResultLabel = (result: ROLL_RESULT) => {
  switch (result) {
    case ROLL_RESULT.HIT:
      return "Strong Hit";
    case ROLL_RESULT.WEAK_HIT:
      return "Weak Hit";
    case ROLL_RESULT.MISS:
      return "Miss";
  }
};

export function DieRollProvider(props: PropsWithChildren) {
  const { children } = props;

  const theme = useTheme();

  const [rolls, setRolls] = useState<Roll[]>([]);

  const roll = (label: string, modifier?: number) => {
    const challenge1 = getRoll(10);
    const challenge2 = getRoll(10);
    const action = getRoll(6);

    const actionTotal = action + (modifier ?? 0);

    let result: ROLL_RESULT = ROLL_RESULT.WEAK_HIT;
    if (actionTotal > challenge1 && actionTotal > challenge2) {
      result = ROLL_RESULT.HIT;
      // Strong Hit
    } else if (actionTotal <= challenge1 && actionTotal <= challenge2) {
      result = ROLL_RESULT.MISS;
    }

    setRolls((prevRolls) => {
      let newRolls = [...prevRolls];

      if (newRolls.length >= 3) {
        newRolls.shift();
      }
      newRolls.push({
        action,
        modifier,
        challenge1,
        challenge2,
        result,
        rollLabel: label,
        timestamp: new Date(),
      });

      return newRolls;
    });

    return result;
  };

  const clearRolls = () => {
    setRolls([]);
  };

  const clearRoll = (index: number) => {
    setRolls((prevRolls) => {
      let newRolls = [...prevRolls];

      newRolls.splice(index, 1);

      return newRolls;
    });
  };

  return (
    <DieRollContext.Provider value={{ rolls, roll }}>
      {children}
      <Box
        position={"fixed"}
        zIndex={10000}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
        bottom={(theme) => theme.spacing(2)}
        right={(theme) => theme.spacing(2)}
      >
        <TransitionGroup>
          {rolls.map((roll, index, array) => (
            <Slide
              direction={"left"}
              key={`${roll.rollLabel}.${roll.challenge1}.${roll.challenge2}.${
                roll.action
              }.${roll.timestamp.getTime()}`}
            >
              <Card
                key={index}
                sx={(theme) => ({
                  px: 2,
                  py: 1,
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  width: "100%",
                  mt: 1,
                })}
                component={ButtonBase}
                onClick={() => clearRoll(index)}
              >
                <Typography
                  variant={index === array.length - 1 ? "h6" : "subtitle1"}
                  fontFamily={(theme) => theme.fontFamilyTitle}
                >
                  {roll.rollLabel}
                </Typography>
                <Box display={"flex"} flexDirection={"row"}>
                  {index === array.length - 1 && (
                    <Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <D6Icon
                          style={{
                            width: 24,
                            height: 24,
                            stroke: theme.palette.grey[300],
                            strokeLinejoin: "round",
                            strokeWidth: 16,
                          }}
                        />
                        <Typography
                          ml={1}
                          color={(theme) => theme.palette.grey[200]}
                        >
                          {roll.action}{" "}
                          {roll.modifier
                            ? `+ ${roll.modifier} = ${
                                roll.action + roll.modifier
                              }`
                            : ""}
                        </Typography>
                      </Box>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <D10Icon
                          style={{
                            width: 24,
                            height: 24,
                            stroke: theme.palette.grey[300],
                            strokeLinejoin: "round",
                            strokeWidth: 16,
                          }}
                        />
                        <Typography
                          ml={1}
                          color={(theme) => theme.palette.grey[200]}
                        >
                          {roll.challenge1}, {roll.challenge2}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {index === array.length - 1 && (
                    <Divider
                      orientation={"vertical"}
                      sx={(theme) => ({
                        alignSelf: "stretch",
                        borderColor: theme.palette.grey[400],
                        height: "auto",
                        mx: 2,
                      })}
                    />
                  )}
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"flex-start"}
                    justifyContent={"center"}
                  >
                    <Typography
                      color={"white"}
                      variant={"h5"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {getRollResultLabel(roll.result)}
                    </Typography>
                    {roll.challenge1 === roll.challenge2 && (
                      <Typography
                        color={(theme) => theme.palette.grey[200]}
                        variant={"caption"}
                        fontFamily={(theme) => theme.fontFamilyTitle}
                      >
                        Doubles
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </Slide>
          ))}
        </TransitionGroup>
        <Slide direction={"left"} in={rolls.length > 0} unmountOnExit>
          <Fab
            variant={"extended"}
            size={"medium"}
            color={"secondary"}
            onClick={() => clearRolls()}
            sx={{ mt: 2 }}
          >
            Clear All
            <ClearIcon sx={{ ml: 1 }} />
          </Fab>
        </Slide>
      </Box>
    </DieRollContext.Provider>
  );
}
