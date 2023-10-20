import {
  Box,
  ButtonBase,
  Card,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { ClockProgressionRoll } from "types/DieRolls.type";
import { D10Icon } from "assets/D10Icon";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";

export interface ClockProgressionRollSnackbarProps {
  roll: ClockProgressionRoll;
  clearRoll?: () => void;
  expanded: boolean;
}

export function ClockProgressionRollSnackbar(
  props: ClockProgressionRollSnackbarProps
) {
  const { roll, clearRoll, expanded } = props;
  const theme = useTheme();

  return (
    <Card
      sx={(theme) => ({
        px: 2,
        py: 1,
        backgroundColor: theme.palette.darkGrey.dark,
        color: theme.palette.darkGrey.contrastText,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        mt: 1,
      })}
      component={clearRoll ? ButtonBase : "div"}
      onClick={clearRoll ? () => clearRoll() : undefined}
    >
      {expanded && roll.oracleTitle && (
        <Typography
          lineHeight={1.2}
          variant={"overline"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {roll.oracleTitle}
        </Typography>
      )}
      <Typography
        variant={expanded ? "h6" : "subtitle1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {roll.rollLabel}
      </Typography>
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"row"}
        mt={expanded ? 1 : 0}
      >
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
              <Typography ml={1}>{roll.roll}</Typography>
            </Box>
          </Box>
        )}
        {expanded && (
          <Divider
            orientation={"vertical"}
            sx={(theme) => ({
              alignSelf: "stretch",
              borderColor: theme.palette.grey[200],
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
          color={"white"}
          maxWidth={"60ch"}
        >
          <MarkdownRenderer markdown={roll.result} inheritColor disableLinks />
        </Box>
      </Box>
    </Card>
  );
}
