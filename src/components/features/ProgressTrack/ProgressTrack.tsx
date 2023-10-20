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
import { DIFFICULTY, PROGRESS_TRACKS, TRACK_TYPES } from "types/Track.type";
import CompleteIcon from "@mui/icons-material/Check";
import DieIcon from "@mui/icons-material/Casino";
import { useConfirm } from "material-ui-confirm";
import { useRoller } from "providers/DieRollProvider";
import { useLinkedDialog } from "providers/LinkedDialogProvider";
import { moveMap } from "data/moves";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";

const trackMoveIdSystemValues: GameSystemChooser<{
  [key in PROGRESS_TRACKS]: string;
}> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    [TRACK_TYPES.VOW]: "ironsworn/moves/quest/fulfill_your_vow",
    [TRACK_TYPES.JOURNEY]: "ironsworn/moves/adventure/reach_your_destination",
    [TRACK_TYPES.FRAY]: "ironsworn/moves/combat/end_the_fight",
    [TRACK_TYPES.BOND_PROGRESS]: "",
  },
  [GAME_SYSTEMS.STARFORGED]: {
    [TRACK_TYPES.VOW]: "starforged/moves/quest/fulfill_your_vow",
    [TRACK_TYPES.JOURNEY]: "starforged/moves/exploration/finish_an_expedition",
    [TRACK_TYPES.FRAY]: "starforged/moves/combat/take_decisive_action",
    [TRACK_TYPES.BOND_PROGRESS]: "starforged/moves/connection/forge_a_bond",
  },
};

export interface ProgressTracksProps {
  trackType?: PROGRESS_TRACKS;
  label?: string;
  difficulty?: DIFFICULTY;
  description?: string;
  max: number;
  value: number;
  onValueChange?: (value: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  hideDifficultyLabel?: boolean;
}

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
    hideDifficultyLabel,
  } = props;

  const trackMoveIds = useGameSystemValue(trackMoveIdSystemValues);

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
      <Box>
        {difficulty && !hideDifficultyLabel && (
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
                color={"inherit"}
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
              backgroundColor:
                theme.palette.darkGrey[
                  theme.palette.mode === "light" ? "main" : "light"
                ],
              color: theme.palette.darkGrey.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.darkGrey.dark,
              },
              borderTopLeftRadius: `${theme.shape.borderRadius}px`,
              borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            <MinusIcon />
          </ButtonBase>
        )}
        <Box
          display={"flex"}
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          }
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
              backgroundColor:
                theme.palette.darkGrey[
                  theme.palette.mode === "light" ? "main" : "light"
                ],
              color: theme.palette.darkGrey.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.darkGrey.dark,
              },

              borderTopRightRadius: `${theme.shape.borderRadius}px`,
              borderBottomRightRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            <PlusIcon />
          </ButtonBase>
        )}
      </Box>
      {onDelete && (
        <Button
          color={"inherit"}
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
          color={"inherit"}
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
