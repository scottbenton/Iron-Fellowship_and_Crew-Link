import { Box, ButtonBase, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ProgressTrackTick } from "./ProgressTrackTick";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import { DIFFICULTY } from "../../types/Track.type";

export interface ProgressTracksProps {
  label: string;
  difficulty?: DIFFICULTY;
  description?: string;
  max: number;
  value: number;
  onValueChange?: (value: number) => void;
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
  const { label, description, difficulty, max, value, onValueChange } = props;

  const [checks, setChecks] = useState<number[]>([]);

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
      {difficulty && (
        <Typography
          variant={"subtitle1"}
          color={(theme) => theme.palette.text.secondary}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {getDifficultyLabel(difficulty)}
        </Typography>
      )}
      <Typography
        variant={"h6"}
        color={(theme) => theme.palette.text.primary}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {label}
      </Typography>
      {description && (
        <Typography
          variant={"subtitle1"}
          color={(theme) => theme.palette.text.secondary}
          whiteSpace={"pre-wrap"}
        >
          {description}
        </Typography>
      )}
      <Box display={"flex"} mt={1}>
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
                borderLeftColor: theme.palette.divider,

                "&:last-of-type": {
                  borderRightColor: theme.palette.divider,
                },
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
            })}
          >
            <PlusIcon />
          </ButtonBase>
        )}
      </Box>
    </Box>
  );
}
