import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import SubtractIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useRef } from "react";
import { useDebouncedState } from "hooks/useDebouncedState";
import ResetIcon from "@mui/icons-material/Replay";
import { useStore } from "stores/store";

export interface MomentumTrackMobileProps {
  value: number;
  onChange: (newValue: number) => Promise<void>;
  min: number;
  max: number;
  resetValue: number;
}
export function MomentumTrackMobile(props: MomentumTrackMobileProps) {
  const { value, onChange, min, max, resetValue } = props;

  const hasUnsavedChangesRef = useRef(false);
  const announce = useStore((store) => store.appState.announce);

  const [localValue, setLocalValue] = useDebouncedState(
    (newValue) => {
      if (newValue !== value) {
        hasUnsavedChangesRef.current = false;
        onChange(newValue).catch(() => setLocalValue(value));
      }
    },
    value,
    500
  );

  const handleChange = (newValue: number | undefined) => {
    if (typeof newValue === "number" && newValue >= min && newValue <= max) {
      hasUnsavedChangesRef.current = true;
      setLocalValue(newValue);
    }
  };

  useEffect(() => {
    if (value !== localValue && !hasUnsavedChangesRef.current) {
      setLocalValue(value);
      announce(`Momentum was updated to ${value}`);
    }
  }, [localValue, value, announce, setLocalValue]);

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius + "px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bgcolor={"background.paperInlayDarker"}
      >
        <Typography
          color={"textSecondary"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          Momentum
        </Typography>
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={1}
        gap={0.5}
        flexGrow={1}
      >
        <IconButton
          onClick={() => handleChange(localValue - 1)}
          disabled={localValue <= min}
          aria-label={`Subtract 1 Momentum`}
        >
          <SubtractIcon />
        </IconButton>
        <ButtonBase
          sx={(theme) => ({
            position: "relative",
            borderRadius: theme.shape.borderRadius + "px",
            bgcolor: "background.paper",
            py: 0.5,
            width: 75,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.divider,
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          })}
          onClick={() => handleChange(resetValue)}
        >
          <ResetIcon
            aria-label={"Reset Momentum Button"}
            sx={(theme) => ({
              position: "absolute",
              top: theme.spacing(0.25),
              left: theme.spacing(0.25),
              width: theme.spacing(1.5),
              height: theme.spacing(1.5),
              color: theme.palette.action.active,
            })}
          />
          <Typography
            sx={(theme) => ({
              color: theme.palette.text.primary,
              paddingX: 0,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1.5rem",
            })}
            variant={"h6"}
            component={"span"}
            textAlign={"center"}
          >
            <Typography component={"span"} variant={"body1"} mr={0.2}>
              {localValue > 0 ? "+" : ""}
            </Typography>
            {localValue}
          </Typography>
        </ButtonBase>
        <IconButton
          onClick={() => handleChange(localValue + 1)}
          disabled={localValue >= max}
          aria-label={`Add 1 Momentum`}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
