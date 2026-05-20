import { Box, Button, Chip, IconButton, Link, Typography } from "@mui/material";
import { useEffect, useId, useState } from "react";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import {
  Difficulty,
  ProgressTracks,
  TrackStatus,
  TrackTypes,
} from "types/Track.type";
import CompleteIcon from "@mui/icons-material/Check";
import DieIcon from "@mui/icons-material/Casino";
import { useConfirm } from "material-ui-confirm";
import { useRoller } from "stores/appState/useRoller";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useStore } from "stores/store";
import { ProgressTrackTick } from "components/features/ProgressTrack/ProgressTrackTick";
import { DebouncedClockCircle } from "components/features/charactersAndCampaigns/Clocks/DebouncedClockCircle";

const trackMoveIdSystemValues: GameSystemChooser<{
  [key in ProgressTracks | TrackTypes.SceneChallenge]: string;
}> = {
  [GAME_SYSTEMS.IRONSWORN]: {
    [TrackTypes.Vow]: "classic/moves/quest/fulfill_your_vow",
    [TrackTypes.Journey]: "classic/moves/adventure/reach_your_destination",
    [TrackTypes.Fray]: "classic/moves/combat/end_the_fight",
    [TrackTypes.SceneChallenge]: "",
    [TrackTypes.BondProgress]: "",
  },
  [GAME_SYSTEMS.STARFORGED]: {
    [TrackTypes.Vow]: "starforged/moves/quest/fulfill_your_vow",
    [TrackTypes.Journey]: "starforged/moves/exploration/finish_an_expedition",
    [TrackTypes.Fray]: "starforged/moves/combat/take_decisive_action",
    [TrackTypes.BondProgress]: "starforged/moves/connection/forge_a_bond",
    [TrackTypes.SceneChallenge]: "starforged/moves/scene_challenge/finish_the_scene",
  },
};

export interface BaseProgressTrackProps {
  trackType?: ProgressTracks | TrackTypes.SceneChallenge;
  status?: TrackStatus;
  label?: string;
  difficulty?: Difficulty;
  description?: string;
  max: number;
  value: number;
  onValueChange?: (value: number) => void;
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  hideDifficultyLabel?: boolean;
  hideRollButton?: boolean;
  smallRollButton?: boolean;
  alwaysRollMax?: boolean;
}

interface ProgressTrackProgressProps extends BaseProgressTrackProps {
  trackType?: ProgressTracks;
}

interface SceneChallengeProgressProps extends BaseProgressTrackProps {
  trackType: TrackTypes.SceneChallenge;
  sceneChallenge: {
    filledSegments: number;
    onChange?: (newValue: number) => void;
  };
}

export type ProgressTracksProps =
  | ProgressTrackProgressProps
  | SceneChallengeProgressProps;

const getDifficultyLabel = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.Dangerous:
      return "Dangerous";
    case Difficulty.Epic:
      return "Epic";
    case Difficulty.Extreme:
      return "Extreme";
    case Difficulty.Formidable:
      return "Formidable";
    case Difficulty.Troublesome:
      return "Troublesome";
  }
};

const getDifficultyStep = (difficulty?: Difficulty): number => {
  switch (difficulty) {
    case Difficulty.Epic:
      return 1;
    case Difficulty.Extreme:
      return 2;
    case Difficulty.Formidable:
      return 4;
    case Difficulty.Dangerous:
      return 8;
    case Difficulty.Troublesome:
      return 12;
    default:
      return 1;
  }
};

export function ProgressTrack(props: ProgressTracksProps) {
  const {
    trackType,
    label,
    status,
    description,
    difficulty,
    max,
    value,
    onValueChange,
    onComplete,
    onDelete,
    onEdit,
    hideDifficultyLabel,
    hideRollButton,
    smallRollButton,
    alwaysRollMax,
  } = props;

  const trackMoveIds = useGameSystemValue(trackMoveIdSystemValues);

  const announce = useStore((store) => store.appState.announce);

  const { rollTrackProgress } = useRoller();
  const openDialog = useStore((store) => store.appState.openDialog);

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);
  const move = trackType ? moveMap[trackMoveIds[trackType]] : undefined;

  const [checks, setChecks] = useState<number[]>([]);

  const confirm = useConfirm();

  const handleCompleteClick = () => {
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
        onComplete && onComplete();
      })
      .catch(() => {});
  };

  const handleDeleteClick = () => {
    confirm({
      title: "Complete Track",
      description: "Are you sure you want to delete this track?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "primary",
      },
    })
      .then(() => {
        onDelete && onDelete();
      })
      .catch(() => {});
  };

  const handleRollClick = () => {
    if (trackType) {
      openDialog(trackMoveIds[trackType]);
      rollTrackProgress(
        label || "",
        alwaysRollMax ? 10 : Math.min(Math.floor(value / 4), 10),
        move?._id ?? "",
        trackType,
      );
    }
  };

  useEffect(() => {
    const checks: number[] = [];

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

  const labelId = useId();

  const getValueText = (value: number) => {
    return `${value} ticks: (${Math.floor(value / 4)} boxes fully filled)`;
  };

  return (
    <Box>
      <Box>
        {difficulty && !hideDifficultyLabel && (
          <Typography
            variant={"subtitle1"}
            component={"p"}
            color={(theme) => theme.palette.text.secondary}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {getDifficultyLabel(difficulty)}
          </Typography>
        )}
        {(label || onEdit) && (
          <Box display={"flex"} alignItems={"center"}>
            <Typography
              variant={"h6"}
              component={"p"}
              id={labelId}
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
            {status === TrackStatus.Completed && (
              <Chip
                label={"Completed"}
                color={"success"}
                sx={{ ml: 2 }}
                size={"small"}
              />
            )}
          </Box>
        )}
        {description && (
          <Typography
            variant={"subtitle1"}
            component={"p"}
            color={(theme) => theme.palette.text.secondary}
            whiteSpace={"pre-wrap"}
          >
            {description}
          </Typography>
        )}
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-start"}
        mt={label ? 1 : 0}
      >
        <Box
          display={"flex"}
          borderRadius={1}
          bgcolor={(theme) => theme.palette.background.paper}
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          }
          border={1}
          borderColor={(theme) => theme.palette.divider}
          role={"meter"}
          aria-labelledby={labelId}
          aria-valuemin={0}
          aria-valuemax={40}
          aria-valuenow={value}
          aria-valuetext={getValueText(value)}
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
                width: 28,
                height: 28,
              })}
            >
              <ProgressTrackTick
                value={value}
                key={index}
                aria-hidden
                size={{ desktop: 24, mobile: 24 }}
              />
            </Box>
          ))}
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          width={280}
        >
          {trackType && !hideRollButton && smallRollButton && (
            <IconButton
              onClick={handleRollClick}
              aria-label={"Roll Track"}
            >
              <DieIcon />
            </IconButton>
          )}
          {onValueChange && (
            <>
              <IconButton
                onClick={() => {
                  if (onValueChange) {
                    const newValue = Math.max(
                      value - getDifficultyStep(difficulty),
                      0
                    );
                    onValueChange(newValue);
                    if (newValue === value) {
                      announce(`${label} is already at zero ticks`);
                    } else {
                      announce(`Updated ${label} to ${getValueText(newValue)}`);
                    }
                  }
                }}
              >
                <MinusIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  if (onValueChange) {
                    const newValue = Math.min(
                      value + getDifficultyStep(difficulty),
                      40
                    );
                    onValueChange(newValue);
                    if (newValue === value) {
                      announce(
                        `${label} is already at its maximum value of 40 ticks`
                      );
                    } else {
                      announce(`Updated ${label} to ${getValueText(newValue)}`);
                    }
                  }
                }}
              >
                <PlusIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {trackType === TrackTypes.SceneChallenge && (
        <Box sx={{ mt: 1 }}>
          <DebouncedClockCircle
            size={"small"}
            segments={4}
            value={props.sceneChallenge.filledSegments}
            voiceLabel={label || "Scene Challenge"}
            onFilledSegmentsChange={
              props.sceneChallenge.onChange
                ? () => {
                    let newValue = props.sceneChallenge.filledSegments + 1;
                    if (newValue > 4) {
                      newValue = 0;
                    }
                    if (props.sceneChallenge.onChange) {
                      props.sceneChallenge.onChange(newValue);
                    }
                  }
                : undefined
            }
          />
        </Box>
      )}
      <Box>
        {onComplete && (
          <Button
            color={"inherit"}
            onClick={handleCompleteClick}
            endIcon={<CompleteIcon />}
            variant={"outlined"}
            sx={{ mt: 1 }}
          >
            Complete Track
          </Button>
        )}
        {trackType && !hideRollButton && !smallRollButton && (
          <Button
            color={"inherit"}
            onClick={handleRollClick}
            endIcon={<DieIcon />}
            variant={"outlined"}
            sx={{ mt: 1 }}
          >
            Roll {move?.name}
          </Button>
        )}
        {onDelete && status === TrackStatus.Completed && (
          <Button color={"error"} sx={{ mt: 1 }} onClick={handleDeleteClick}>
            Delete Permanently
          </Button>
        )}
      </Box>
    </Box>
  );
}
