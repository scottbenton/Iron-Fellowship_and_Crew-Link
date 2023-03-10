import {
  Box,
  ButtonBase,
  Card,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { OracleRoll } from "../DieRollContext";
import { D10Icon } from "assets/D10Icon";

export interface OracleRollSnackbarProps {
  roll: OracleRoll;
  clearRoll: () => void;
  expanded: boolean;
}

export function OracleRollSnackbar(props: OracleRollSnackbarProps) {
  const { roll, clearRoll, expanded } = props;

  return (
    <Card
      sx={(theme) => ({
        px: 2,
        py: 1,
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mt: 1,
      })}
      component={ButtonBase}
      onClick={() => clearRoll()}
    >
      <Typography
        variant={expanded ? "h6" : "subtitle1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {roll.rollLabel}
      </Typography>
      <Box display={"flex"} flexDirection={"row"} mt={expanded ? 1 : 0}>
        {expanded && (
          <Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <div>
                <D10Icon />
                <D10Icon />
              </div>
              <Typography ml={1} color={(theme) => theme.palette.grey[200]}>
                {roll.roll}
              </Typography>
            </Box>
          </Box>
        )}
        {expanded && (
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
            variant={"h6"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {roll.result}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
