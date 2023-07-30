import {
  Box,
  Button,
  ButtonBase,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProgressTrackTick } from "./ProgressTrackTick";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import { DIFFICULTY, TRACK_TYPES } from "../../types/Track.type";
import CompleteIcon from "@mui/icons-material/Check";
import DieIcon from "@mui/icons-material/Casino";
import { useConfirm } from "material-ui-confirm";
import { useRoller } from "providers/DieRollProvider";
import { useLinkedDialog } from "providers/LinkedDialogProvider";
import { moveMap } from "data/moves";

export interface ProgressTracksProps {
  trackType?: TRACK_TYPES;
  label?: string;
  difficulty?: DIFFICULTY;
  description?: string;
  max: number;
  value: number;
  onValueChange?: (value: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const trackMoveIds: { [key in TRACK_TYPES]: string } = {
  [TRACK_TYPES.VOW]: "ironsworn/moves/quest/fulfill_your_vow",
  [TRACK_TYPES.JOURNEY]: "ironsworn/moves/adventure/reach_your_destination",
  [TRACK_TYPES.FRAY]: "ironsworn/moves/combat/end_the_fight",
};

const getDifficultyLabel = (difficulty: DIFFICULTY): string => {
  switch (difficulty) {
    case DIFFICULTY.DANGEROUS:
      return "Dangerous";
    case DIFFICULTY.EPIC:
      return "Epic";
    case DIFFICULTY.EXTREME:
      return "Extreme";
    case DIFFICULTY.FORMIDABLE:
      return "Formidable";
    case DIFFICULTY.TROUBLESOME:
      return "Troublesome";
  }
};

const getDifficultyStep = (difficulty?: DIFFICULTY): number => {
  switch (difficulty) {
    case DIFFICULTY.EPIC:
      return 1;
    case DIFFICULTY.EXTREME:
      return 2;
    case DIFFICULTY.FORMIDABLE:
      return 4;
    case DIFFICULTY.DANGEROUS:
      return 8;
    case DIFFICULTY.TROUBLESOME:
      return 12;
    default:
      return 1;
  }
};

export function ProgressTrack(props: ProgressTracksProps) {
  const {
    trackType,
    label,
    description,
    difficulty,
    max,
    value,
    onValueChange,
    onDelete,
    onEdit,
  } = props;

  const { rollTrackProgress } = useRoller();
  const { openDialog } = useLinkedDialog();
  const move = trackType ? moveMap[trackMoveIds[trackType]] : undefined;

  const [checks, setChecks] = useState<number[]>([]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const confirm = useConfirm();

  const handleDeleteClick = () => {
    confirm({
      title: "Complete Track",
      description: "Are you sure you want to complete this track?",
      confirmationText: "Complete",
      confirmationButtonProps: {
        variant: "contained",
        color: "primary",
      },
    })
      .then(() => {
        handleDelete();
      })
      .catch(() => {});
  };

  const handleRollClick = () => {
    if (trackType) {
      openDialog(trackMoveIds[trackType]);
      rollTrackProgress(
        trackType,
        label || "",
        Math.min(Math.floor(value / 4), 10)
      );
    }
  };

  useEffect(() => {
    let checks: number[] = [];

    let checksIndex = 0;
    let checksValue = 0;

    for (let i = 0; i <= max; i++) {
      if (i % 4 === 0 && i !== 0) {
        checks[checksIndex] = checksValue;
        checksIndex++;
        checksValue = 0;
      }

      if (i < value) {
        checksValue++;
      }
    }

    setChecks(checks);
  }, [max, value]);

  return (
    <Box>
      <Box
        display={"flex"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Box>
          {difficulty && (
            <Typography
              variant={"subtitle1"}
              color={(theme) => theme.palette.text.secondary}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {getDifficultyLabel(difficulty)}
            </Typography>
          )}
          {(label || onEdit) && (
            <Typography
              variant={"h6"}
              color={(theme) => theme.palette.text.primary}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {label + " "}
              {onEdit && (
                <Link
                  component={"button"}
                  sx={{ ml: 2 }}
                  onClick={() => onEdit()}
                >
                  Edit
                </Link>
              )}
            </Typography>
          )}
          {description && (
            <Typography
              variant={"subtitle1"}
              color={(theme) => theme.palette.text.secondary}
              whiteSpace={"pre-wrap"}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <Box display={"flex"} mt={label ? 1 : 0}>
        {onValueChange && (
          <ButtonBase
            onClick={() =>
              onValueChange &&
              onValueChange(
                value > 0 ? value - getDifficultyStep(difficulty) : 0
              )
            }
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
              borderTopLeftRadius: theme.shape.borderRadius,
              borderBottomLeftRadius: theme.shape.borderRadius,
            })}
          >
            <MinusIcon />
          </ButtonBase>
        )}
        <Box
          display={"flex"}
          color={(theme) => theme.palette.grey[600]}
          borderTop={1}
          borderBottom={1}
          borderColor={(theme) => theme.palette.divider}
        >
          {checks.map((value, index) => (
            <Box
              key={index}
              sx={(theme) => ({
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "transparent",
                borderLeftColor:
                  index !== 0 ? theme.palette.divider : undefined,
              })}
            >
              <ProgressTrackTick value={value} key={index} />
            </Box>
          ))}
        </Box>
        {onValueChange && (
          <ButtonBase
            onClick={() =>
              onValueChange(
                value < max ? value + getDifficultyStep(difficulty) : max
              )
            }
            focusRipple
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },

              borderTopRightRadius: theme.shape.borderRadius,
              borderBottomRightRadius: theme.shape.borderRadius,
            })}
          >
            <PlusIcon />
          </ButtonBase>
        )}
      </Box>
      {onDelete && (
        <Button
          onClick={handleDeleteClick}
          endIcon={<CompleteIcon />}
          variant={"outlined"}
          sx={{ mt: 2, mr: 1 }}
        >
          Complete Track
        </Button>
      )}
      {trackType && (
        <Button
          onClick={handleRollClick}
          endIcon={<DieIcon />}
          variant={"outlined"}
          sx={{ mt: 2 }}
        >
          Roll {move?.Title.Short}
        </Button>
      )}
    </Box>
  );
}
