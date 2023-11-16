import { Box, IconButton } from "@mui/material";
import SubtractIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { StatComponent } from "components/features/characters/StatComponent";
import { useEffect, useRef, useState } from "react";
import { useScreenReaderAnnouncement } from "providers/ScreenReaderAnnouncementProvider";
import { useDebouncedState } from "hooks/useDebouncedState";

export interface MobileStatTrackProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => Promise<void>;
}

export function MobileStatTrack(props: MobileStatTrackProps) {
  const { label, value, min, max, onChange } = props;

  const hasUnsavedChangesRef = useRef(false);
  const { setAnnouncement } = useScreenReaderAnnouncement();

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
      setAnnouncement(`${label} was updated to ${value}`);
    }
  }, [localValue, value, setAnnouncement]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius + "px",
        gap: 0.5,
        py: 0.5,
        px: 1,
      })}
    >
      <IconButton
        disabled={localValue <= min}
        onClick={() => handleChange(localValue - 1)}
        aria-label={`Subtract 1 ${label}`}
      >
        <SubtractIcon />
      </IconButton>
      <StatComponent label={label} value={localValue} />
      <IconButton
        disabled={localValue >= max}
        onClick={() => handleChange(localValue + 1)}
        aria-label={`Add 1 ${label}`}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
