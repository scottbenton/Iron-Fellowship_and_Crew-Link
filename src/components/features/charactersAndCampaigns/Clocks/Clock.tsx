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
import { Clock as IClock, TrackStatus } from "types/Track.type";
import { ClockCircle } from "./ClockCircle";
import CheckIcon from "@mui/icons-material/Check";
import { useConfirm } from "material-ui-confirm";
import DieIcon from "@mui/icons-material/Casino";
import { useRoller } from "stores/appState/useRoller";
import { useSystemOracles } from "hooks/useSystemOracle";
import { AskTheOracle } from "config/system.config";

export interface ClockProps {
  clock: IClock;
  onEdit?: () => void;
  onValueChange?: (value: number) => void;
  onSelectedOracleChange?: (oracleKey: AskTheOracle) => void;
  onComplete?: () => void;
  handleDelete?: () => void;
}

export function Clock(props: ClockProps) {
  const {
    clock,
    onEdit,
    onValueChange,
    onSelectedOracleChange,
    onComplete,
    handleDelete,
  } = props;

  const { askTheOracle } = useSystemOracles();

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

  const handleDeleteClick = () => {
    if (handleDelete) {
      confirm({
        title: "Delete Clock",
        description: "Are you sure you want to delete this clock?",
        confirmationText: "Delete",
        confirmationButtonProps: {
          variant: "contained",
          color: "primary",
        },
      })
        .then(() => {
          handleDelete();
        })
        .catch(() => {});
    }
  };

  const handleProgressionRoll = async () => {
    if (onValueChange) {
      const result = await rollClockProgression(
        clock.label,
        askTheOracle[clock.oracleKey ?? AskTheOracle.Likely]
      );

      if (
        result?.result.toLocaleLowerCase() === "yes" &&
        clock.value < clock.segments
      ) {
        if (result.match) {
          onValueChange(clock.value + 2);
        } else {
          onValueChange(clock.value + 1);
        }
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
        {clock.status === TrackStatus.Completed && (
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
            value={clock.oracleKey ?? AskTheOracle.Likely}
            onChange={(evt) =>
              onSelectedOracleChange &&
              onSelectedOracleChange(evt.target.value as AskTheOracle)
            }
            disabled={!onSelectedOracleChange}
            fullWidth
          >
            <MenuItem value={AskTheOracle.AlmostCertain}>
              Almost Certain
            </MenuItem>
            <MenuItem value={AskTheOracle.Likely}>Likely</MenuItem>
            <MenuItem value={AskTheOracle.FiftyFifty}>Fifty Fifty</MenuItem>
            <MenuItem value={AskTheOracle.Unlikely}>Unlikely</MenuItem>
            <MenuItem value={AskTheOracle.SmallChance}>Small Chance</MenuItem>
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
      {handleDelete && clock.status === TrackStatus.Completed && (
        <Button color={"error"} sx={{ mt: 1 }} onClick={handleDeleteClick}>
          Delete Permanently
        </Button>
      )}
    </Box>
  );
}
