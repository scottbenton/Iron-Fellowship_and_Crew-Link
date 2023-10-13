import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "providers/SnackbarProvider";
import { ProgressTrack } from "../ProgressTrack";
import { DIFFICULTY, TRACK_TYPES } from "types/Track.type";

export interface BondsSectionProps {
  isStarforged: boolean;
  difficulty?: DIFFICULTY;

  bondedCharacters?: string[];
  isBonded: boolean;
  bondProgress?: number;
  onBondToggle?: (bonded: boolean) => void;
  updateBondProgressValue?: (value: number) => void;

  connectedCharacters?: string[];
  hasConnection: boolean;
  onConnectionToggle?: (connected: boolean) => void;

  disableToggle?: boolean;
  inheritedBondName?: string;
}

export function BondsSection(props: BondsSectionProps) {
  const {
    isStarforged,
    difficulty,
    isBonded,
    onBondToggle,
    bondedCharacters,
    updateBondProgressValue,
    bondProgress,
    connectedCharacters,
    hasConnection,
    onConnectionToggle,

    disableToggle,
    inheritedBondName,
  } = props;

  const { info } = useSnackbar();

  return (
    <>
      {(onBondToggle || (onConnectionToggle && isStarforged)) && (
        <Grid item xs={12}>
          <>
            {onBondToggle && (
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={disableToggle}
                    checked={isBonded ?? false}
                    onChange={(evt, value) => {
                      onBondToggle(value);
                      info(
                        "Don't forget to update your Bonds track on the Tracks Tab"
                      );
                    }}
                  />
                }
                label={
                  "Bonded" +
                  (inheritedBondName && disableToggle
                    ? ` via ${inheritedBondName}`
                    : "")
                }
              />
            )}
            {isStarforged && onConnectionToggle && (
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={disableToggle}
                    checked={hasConnection ?? false}
                    onChange={(evt, value) => {
                      onConnectionToggle(value);
                    }}
                  />
                }
                label={"Connected"}
                sx={{ ml: 2 }}
              />
            )}
          </>
        </Grid>
      )}
      {!isBonded &&
        updateBondProgressValue &&
        bondProgress !== undefined &&
        isStarforged && (
          <Grid item xs={12}>
            <ProgressTrack
              label={"Bond Progress"}
              max={40}
              value={bondProgress}
              onValueChange={(value) => updateBondProgressValue(value)}
              difficulty={difficulty}
              trackType={TRACK_TYPES.BOND_PROGRESS}
              hideDifficultyLabel
            />
          </Grid>
        )}
      {bondedCharacters && bondedCharacters.length > 0 && (
        <Grid item xs={12}>
          <Typography variant={"caption"} color={"textSecondary"}>
            Bonded Characters
          </Typography>
          <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
            {bondedCharacters.map((characterName, index) => (
              <Chip key={index} variant={"outlined"} label={characterName} />
            ))}
          </Stack>
        </Grid>
      )}
      {connectedCharacters &&
        connectedCharacters.length > 0 &&
        isStarforged && (
          <Grid item xs={12}>
            <Typography variant={"caption"} color={"textSecondary"}>
              Connected Characters
            </Typography>
            <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
              {connectedCharacters.map((characterName, index) => (
                <Chip key={index} variant={"outlined"} label={characterName} />
              ))}
            </Stack>
          </Grid>
        )}
    </>
  );
}
