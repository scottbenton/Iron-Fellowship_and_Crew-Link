import { Box, Divider, Typography } from "@mui/material";
import { ROLL_RESULT, StatRoll } from "types/DieRolls.type";
import { D6Icon } from "assets/D6Icon";
import { D10Icon } from "assets/D10Icon";

export const getRollResultLabel = (result: ROLL_RESULT) => {
  switch (result) {
    case ROLL_RESULT.HIT:
      return "Strong Hit";
    case ROLL_RESULT.WEAK_HIT:
      return "Weak Hit";
    case ROLL_RESULT.MISS:
      return "Miss";
  }
};

export interface StatRollCardProps {
  roll: StatRoll;
}

export function StatRollCard(props: StatRollCardProps) {
  const { roll } = props;
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      })}
    >
      <Typography variant={"h4"} fontFamily={(theme) => theme.fontFamilyTitle}>
        {roll.rollLabel}
      </Typography>
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <D6Icon sx={{ width: 40, height: 40 }} />
            <Typography
              ml={3}
              variant={"h4"}
              whiteSpace={"nowrap"}
              color={(theme) => theme.palette.grey[200]}
            >
              {roll.action + (roll.modifier ?? 0) + (roll.adds ?? 0)}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <D10Icon sx={{ width: 40, height: 40 }} />
            <Typography
              ml={3}
              variant={"h4"}
              whiteSpace={"nowrap"}
              color={(theme) => theme.palette.grey[200]}
            >
              {roll.challenge1}, {roll.challenge2}
            </Typography>
          </Box>
        </Box>

        <Divider
          orientation={"vertical"}
          sx={(theme) => ({
            alignSelf: "stretch",
            borderColor: theme.palette.grey[400],
            height: "auto",
            mx: 2,
          })}
        />

        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"center"}
        >
          <Typography
            color={"white"}
            variant={"h4"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {getRollResultLabel(roll.result)}
          </Typography>
          {roll.challenge1 === roll.challenge2 && (
            <Typography
              variant={"h5"}
              whiteSpace={"nowrap"}
              color={(theme) => theme.palette.grey[200]}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Doubles
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
