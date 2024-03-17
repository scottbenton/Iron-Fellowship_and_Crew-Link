import {
  Box,
  Button,
  Card,
  Chip,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Clock as IClock, TRACK_STATUS } from "types/Track.type";
import { ClockCircle } from "./ClockCircle";
import CheckIcon from "@mui/icons-material/Check";
import { useConfirm } from "material-ui-confirm";
import { CLOCK_ORACLES_KEYS } from "types/Track.type";
import DieIcon from "@mui/icons-material/Casino";
import { useRoller } from "stores/appState/useRoller";

const clockOracleMap = {
  [CLOCK_ORACLES_KEYS.ALMOST_CERTAIN]:
    "starforged/oracles/moves/ask_the_oracle/almost_certain",
  [CLOCK_ORACLES_KEYS.LIKELY]: "starforged/oracles/moves/ask_the_oracle/likely",
  [CLOCK_ORACLES_KEYS.FIFTY_FIFTY]:
    "starforged/oracles/moves/ask_the_oracle/fifty-fifty",
  [CLOCK_ORACLES_KEYS.UNLIKELY]:
    "starforged/oracles/moves/ask_the_oracle/unlikely",
  [CLOCK_ORACLES_KEYS.SMALL_CHANCE]:
    "starforged/oracles/moves/ask_the_oracle/small_chance",
};

export interface ClockProps {
  clock: IClock;
  onEdit?: () => void;
  onValueChange?: (value: number) => void;
  onSelectedOracleChange?: (oracleKey: CLOCK_ORACLES_KEYS) => void;
  onComplete?: () => void;
}

export function Clock(props: ClockProps) {
  const { clock, onEdit, onValueChange, onSelectedOracleChange, onComplete } =
    props;

  const { rollClockProgression } = useRoller();

  const confirm = useConfirm();

  const handleCompleteClick = () => {
    if (onComplete) {
      confirm({
        title: "Complete Clock",
        description: "Are you sure you want to complete this clock?",
        confirmationText: "Complete",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
      })
        .then(() => {
          onComplete();
        })
        .catch(() => {});
    }
  };

  const handleProgressionRoll = () => {
    if (onValueChange) {
      const result = rollClockProgression(
        clock.label,
        clockOracleMap[clock.oracleKey ?? CLOCK_ORACLES_KEYS.FIFTY_FIFTY]
      );

      if (result && clock.value < clock.segments) {
        onValueChange(clock.value + 1);
      }
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
      <Box display={"flex"} alignItems={"center"}>
        <Typography
          fontFamily={(theme) => theme.fontFamilyTitle}
          variant={"h6"}
        >
          {clock.label}
          {onEdit && (
            <Link
              color={"inherit"}
              component={"button"}
              sx={{ ml: 2 }}
              onClick={() => onEdit()}
            >
              Edit
            </Link>
          )}
        </Typography>
        {clock.status === TRACK_STATUS.COMPLETED && (
          <Chip
            label={"Completed"}
            color={"success"}
            sx={{ ml: 2 }}
            size={"small"}
          />
        )}
      </Box>
      {clock.description && (
        <Typography
          variant={"subtitle1"}
          color={(theme) => theme.palette.text.secondary}
          whiteSpace={"pre-wrap"}
        >
          {clock.description}
        </Typography>
      )}
      <Card
        sx={(theme) => ({
          bgcolor: theme.palette.background.paperInlay,
          p: 1,
          display: "flex",
          flexWrap: "wrap",
          mt: 1,
        })}
        variant={"outlined"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          mr={2}
          minWidth={200}
        >
          <TextField
            label={"Roll Progress"}
            select
            value={clock.oracleKey ?? CLOCK_ORACLES_KEYS.FIFTY_FIFTY}
            onChange={(evt) =>
              onSelectedOracleChange &&
              onSelectedOracleChange(evt.target.value as CLOCK_ORACLES_KEYS)
            }
            disabled={!onSelectedOracleChange}
            fullWidth
          >
            <MenuItem value={CLOCK_ORACLES_KEYS.ALMOST_CERTAIN}>
              Almost Certain
            </MenuItem>
            <MenuItem value={CLOCK_ORACLES_KEYS.LIKELY}>Likely</MenuItem>
            <MenuItem value={CLOCK_ORACLES_KEYS.FIFTY_FIFTY}>
              Fifty Fifty
            </MenuItem>
            <MenuItem value={CLOCK_ORACLES_KEYS.UNLIKELY}>Unlikely</MenuItem>
            <MenuItem value={CLOCK_ORACLES_KEYS.SMALL_CHANCE}>
              Small Chance
            </MenuItem>
          </TextField>
          {onValueChange && (
            <Button
              sx={{ mt: 1 }}
              color={"inherit"}
              endIcon={<DieIcon />}
              onClick={() => handleProgressionRoll()}
            >
              Roll Progress
            </Button>
          )}
        </Box>
        <ClockCircle
          value={clock.value}
          segments={clock.segments}
          onClick={
            onValueChange
              ? () => {
                  onValueChange(
                    clock.value >= clock.segments ? 0 : clock.value + 1
                  );
                }
              : undefined
          }
        />
      </Card>
      {onComplete && (
        <Button
          variant={"outlined"}
          color={"inherit"}
          onClick={handleCompleteClick}
          sx={{ mt: 1 }}
          endIcon={<CheckIcon />}
        >
          Complete Clock
        </Button>
      )}
    </Box>
  );
}
