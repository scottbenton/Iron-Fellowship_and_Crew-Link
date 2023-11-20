import { Box, Divider, Typography } from "@mui/material";
import { ROLL_RESULT, TrackProgressRoll } from "types/DieRolls.type";
import { D10Icon } from "assets/D10Icon";

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

export interface TrackProgressRollCardProps {
  roll: TrackProgressRoll;
}

export function TrackProgressRollCard(props: TrackProgressRollCardProps) {
  const { roll } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
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
            <Typography
              color={(theme) => theme.palette.grey[200]}
              variant={"h5"}
              whiteSpace={"nowrap"}
            >
              Progress: {roll.trackProgress}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <D10Icon sx={{ height: 40, width: 40 }} />
            <Typography
              ml={3}
              variant={"h5"}
              color={(theme) => theme.palette.grey[200]}
              whiteSpace={"nowrap"}
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
            variant={"h3"}
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
    </Box>
  );
}
