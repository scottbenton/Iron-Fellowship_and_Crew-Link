import { Datasworn } from "@datasworn/core";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import DieIcon from "@mui/icons-material/Casino";

import { ProgressTrackTick } from "components/features/ProgressTrack/ProgressTrackTick";
import { useGameSystem } from "hooks/useGameSystem";
import { useId } from "react";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { LEGACY_TrackTypes } from "types/LegacyTrack.type";
import { useConfirm } from "material-ui-confirm";
import { useRoller } from "stores/appState/useRoller";

export interface LegacyTrackProps {
  rule: Datasworn.SpecialTrackRule;
  value: number;
  isLegacy: boolean;
  toggleIsLegacy?: (isLegacy: boolean) => void;
  onValueChange?: (value: number) => void;
  trackType?: LEGACY_TrackTypes;
}
export function LegacyTrack(props: LegacyTrackProps) {
  const { rule, value, isLegacy, toggleIsLegacy, onValueChange, trackType } = props;

  const isIronsworn = useGameSystem().gameSystem === GAME_SYSTEMS.IRONSWORN;

  const labelId = useId();
  const getValueText = (value: number) => {
    return `${value} ticks: (${Math.floor(value / 4)} boxes fully filled)`;
  };

  const announce = useStore((store) => store.appState.announce);

  const checks = [];
  let checksIndex = 0;
  let checksValue = 0;

  for (let i = 0; i <= 40; i++) {
    if (i % 4 === 0 && i !== 0) {
      checks[checksIndex] = checksValue;
      checksIndex++;
      checksValue = 0;
    }

    if (i < (value)) {
      checksValue++;
    }
  }
  
  const openDialog = useStore((store) => store.appState.openDialog);
  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);
  const legacyMoveId = "move:starforged/legacy/continue_a_legacy";
  const experienceMoveId = "move:starforged/legacy/earn_experience";
  const move = legacyMoveId in moveMap ? moveMap[legacyMoveId] : undefined;

  const confirm = useConfirm();

  const { rollTrackProgress } = useRoller();
  const handleRollClick = () => {
    openDialog(legacyMoveId);
    rollTrackProgress(
      rule.label,
      isLegacy ? 10 : Math.min(Math.floor(value / 4), 10),
      move?._id ?? "",
      trackType
    );
  };

  const handleLegacyClick = (checked: boolean) => {
    confirm({
      title: "Mark Legacy",
      description: (
        <div>
          {`Are you sure you want to ${checked ? "mark" : "unmark"} this track as completed? `}
          {"Your progress will be cleared. See "}
          <Link onClick={() => openDialog(experienceMoveId)} >
            Earn Experience
          </Link>
          {" for more information."}
        </div>
      ),
      confirmationText: "Confirm",
      confirmationButtonProps: {
        variant: "contained",
        color: "primary",
      }
    })
      .then(() => {
        toggleIsLegacy && toggleIsLegacy(checked);
      })
      .catch(() => {});
  };

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
      <Typography
        id={labelId}
        variant="h6"
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {rule.label}
      </Typography>

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
              borderLeftColor: index !== 0 ? theme.palette.divider : undefined,
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
        alignItems={"center"}
        justifyContent={"space-between"}
        width={280}
      >
        {!isIronsworn && (
          <FormControlLabel
            disabled={!toggleIsLegacy}
            control={
              <Checkbox
                checked={isLegacy}
                onChange={(evt, value) =>
                  handleLegacyClick(value)
                }
              />
            }
            label={"10"}
            sx={{ pl: 1 }}
          />
        )}
        {onValueChange && (
          <div>
            <IconButton
              onClick={() => {
                if (onValueChange) {
                  const oldValue = value;
                  const newValue = Math.max(oldValue - 1, 0);
                  onValueChange(newValue);
                  if (newValue === oldValue) {
                    announce(`${rule.label} is already at zero ticks`);
                  } else {
                    announce(
                      `Updated ${rule.label} to ${getValueText(newValue)}`
                    );
                  }
                }
              }}
            >
              <MinusIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                if (onValueChange) {
                  const oldValue = value;
                  const newValue = Math.min(oldValue + 1, 40);
                  onValueChange(newValue);
                  if (newValue === oldValue) {
                    announce(
                      `${rule.label} is already at its maximum value of 40 ticks`
                    );
                  } else {
                    announce(
                      `Updated ${rule.label} to ${getValueText(newValue)}`
                    );
                  }
                }
              }}
            >
              <PlusIcon />
            </IconButton>
            {!isIronsworn && (
              <IconButton
                aria-label="Roll Track"
                onClick={handleRollClick}
                sx={{
                  height: 43,
                  width: 43,
                }}
              >
                <DieIcon />
              </IconButton>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
}
