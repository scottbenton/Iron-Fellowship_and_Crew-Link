import {
  Box,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckedIcon from "@mui/icons-material/CheckBox";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import DieIcon from "@mui/icons-material/Casino";

import { ProgressTrackTick } from "components/features/ProgressTrack/ProgressTrackTick";
import { useId } from "react";
import { useStore } from "stores/store";
import { useRoller } from "stores/appState/useRoller";
import { LEGACY_TrackTypes } from "types/LegacyTrack.type";
import { useConfirm } from "material-ui-confirm";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { useIsMobile } from "hooks/useIsMobile";
import starforged from "@datasworn/starforged/json/starforged.json";

export interface LegacyTrackProps {
  label: string;
  value: number;
  checkedExperience: { [key: number]: boolean };
  onValueChange?: (value: number) => void;
  onExperienceChecked?: (index: number, checked: boolean) => void;
  isLegacy: boolean;
  onIsLegacyChecked?: (checked: boolean) => void;
  trackType?: LEGACY_TrackTypes;
}

export function LegacyTrack(props: LegacyTrackProps) {
  const {
    label,
    value,
    checkedExperience,
    onValueChange,
    onExperienceChecked,
    isLegacy,
    onIsLegacyChecked,
    trackType
  } = props;

  const isMobile = useIsMobile();

  const checks = [];
  let checksIndex = 0;
  let checksValue = 0;

  for (let i = 0; i <= 40; i++) {
    if (i % 4 === 0 && i !== 0) {
      checks[checksIndex] = checksValue;
      checksIndex++;
      checksValue = 0;
    }

    if (i < value) {
      checksValue++;
    }
  }

  const labelId = useId();
  const getValueText = (value: number) => {
    return `${value} ticks: (${Math.floor(value / 4)} boxes fully filled)`;
  };

  const openDialog = useStore((store) => store.appState.openDialog);
  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);

  const legacyMoveId = starforged.moves.legacy.contents.continue_a_legacy._id;
  const experienceMoveId = starforged.moves.legacy.contents.earn_experience._id;

  const move = Object.keys(moveMap).includes(legacyMoveId) ? moveMap[legacyMoveId] : undefined;

  const { rollTrackProgress } = useRoller();
  const handleRollClick = () => {
    openDialog(legacyMoveId);
    rollTrackProgress(
      label || "",
      isLegacy ? 10 : Math.min(Math.floor(value / 4), 10),
      move?._id ?? "",
      trackType
    );
  };

  const confirm = useConfirm();

  const handleLegacyClick = (checked: boolean) => {
    confirm({
      title: "Mark Legacy",
      description: (
        <MarkdownRenderer
          markdown={
            `Are you sure you want to ${
              checked ? "mark" : "unmark"
            } this track as completed? Your progress will be cleared. See [Earn Experience](datasworn:${
              experienceMoveId
            }) for more information.`
          }
          inlineParagraph
        />
      ),
      confirmationText: "Confirm",
      confirmationButtonProps: {
        variant: "contained",
        color: "primary",
      }
    })
      .then(() => {
        onIsLegacyChecked && onIsLegacyChecked(checked);
      })
      .catch(() => {});
  };

  const announce = useStore((store) => store.appState.announce);

  const rollButton = (
    <IconButton
      aria-label="Roll Track"
      onClick={handleRollClick}
      sx={{
        p: 0,
        mr: 1,
        height: isMobile ? 34 : 43,
        width: isMobile ? 34 : 43,
      }}
    >
      <DieIcon fontSize={"large"}/>
    </IconButton>
  );

  const increaseButton = (
    <ButtonBase
      onClick={() => {
        if (onValueChange) {
          const newValue = Math.min(value + 1, 40);
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
      sx={(theme) => ({
        height: isMobile ? 34 : 43,
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
  );

  const decreaseButton = (
    <ButtonBase
      onClick={() => {
        if (onValueChange) {
          const newValue = Math.max(value - 1, 0);
          onValueChange(newValue);
          if (newValue === value) {
            announce(`${label} is already at zero ticks`);
          } else {
            announce(`Updated ${label} to ${getValueText(newValue)}`);
          }
        }
      }}
      sx={(theme) => ({
        height: isMobile ? 34 : 43,
        mr: isMobile? 0.5 : undefined,
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
  );

  return (
    <Box display={"flex"}>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant={"h6"}
            color={(theme) => theme.palette.text.primary}
            fontFamily={(theme) => theme.fontFamilyTitle}
            sx={{ mr: 4 }}
            id={labelId}
          >
            {label}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isLegacy}
                disabled={!onIsLegacyChecked}
                onChange={(evt, value) =>
                  handleLegacyClick(value)
                }
              />
            }
            label={"10"}
          />
        </Box>
        <Box
          display={"flex"}
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          }
        >
          {onValueChange && !isMobile && (
            <>
              {rollButton}
              {decreaseButton}
            </>
          )}
          <Box>
            <Box
              display={"flex"}
              bgcolor={(theme) => theme.palette.background.paper}
              color={(theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[600]
                  : theme.palette.grey[300]
              }
              borderTop={1}
              borderBottom={1}
              borderLeft={onValueChange ? 0 : 1}
              borderRight={onValueChange ? 0 : 1}
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
                    borderColor: isMobile ? theme.palette.divider : "transparent",
                    borderLeftColor:
                      index !== 0 ? theme.palette.divider : undefined,
                    width: isMobile ? 29 : 42,
                    height: isMobile ? 29 : 42,
                  })}
                >
                  <ProgressTrackTick
                    value={value}
                    key={index}
                    aria-hidden
                    size={{ mobile: 28, desktop: 40 }}
                  />
                </Box>
              ))}
            </Box>
            <Box display={"flex"}>
              {checks.map((value, index) => (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  fontSize={isMobile ? 14 : 18}
                  key={index}
                  width={isMobile ? 29 : 42}
                >
                  <Checkbox
                    sx={{ p: 0 }}
                    icon={<UncheckedIcon fontSize={"inherit"} />}
                    checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                    disabled={value !== 4 || !onExperienceChecked}
                    checked={checkedExperience[index * 2] ?? false}
                    onChange={(evt, checked) =>
                      onExperienceChecked &&
                      onExperienceChecked(index * 2, checked)
                    }
                  />
                  {!isLegacy && (
                    <Checkbox
                      sx={{ p: 0 }}
                      icon={<UncheckedIcon fontSize={"inherit"} />}
                      checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                      disabled={value !== 4 || !onExperienceChecked}
                      checked={checkedExperience[index * 2 + 1] ?? false}
                      onChange={(evt, checked) =>
                        onExperienceChecked &&
                        onExperienceChecked(index * 2 + 1, checked)
                      }
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          {onValueChange && !isMobile && increaseButton}
        </Box>
        {onValueChange && isMobile && (
          <Box display={"flex"} justifyContent={"space-between"} pt={1} >
            {rollButton}
            <Box>
              {decreaseButton}
              {increaseButton}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
