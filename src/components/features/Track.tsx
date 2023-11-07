import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  SxProps,
  Theme,
  ButtonBase,
} from "@mui/material";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useScreenReaderAnnouncement } from "providers/ScreenReaderAnnouncementProvider";
import { useEffect, useId, useRef, useState } from "react";

export interface TrackProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (newValue: number) => Promise<boolean | void>;
  sx?: SxProps<Theme>;
  disabled?: boolean;
}

function getArr(min: number, max: number): number[] {
  let arr: number[] = [];

  for (let i = min; i <= max; i++) {
    arr.push(i);
  }

  return arr;
}

export function Track(props: TrackProps) {
  const { label, min, max, value, onChange, sx, disabled } = props;

  const [numbers, setNumbers] = useState<number[]>([]);
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
    setNumbers(getArr(min, max));
  }, [min, max]);

  useEffect(() => {
    if (value !== localValue && !hasUnsavedChangesRef.current) {
      setLocalValue(value);
      setAnnouncement(`${label} was updated to ${value}`);
    }
  }, [localValue, value, setAnnouncement]);

  const labelId = useId();

  return (
    <Box
      role={"group"}
      sx={sx}
      display={"flex"}
      overflow={"auto"}
      component={"div"}
      aria-labelledby={labelId}
    >
      {label && (
        <Box
          bgcolor={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.darkGrey.light
              : theme.palette.grey[400]
          }
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.darkGrey.contrastText
              : theme.palette.grey[800]
          }
          px={0.5}
          display={"inline"}
          sx={(theme) => ({
            borderTopLeftRadius: `${theme.shape.borderRadius}px`,
            borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
          })}
        >
          <Typography
            fontFamily={(theme) => theme.fontFamilyTitle}
            variant={"subtitle1"}
            id={labelId}
            component={"span"}
          >
            {label}
          </Typography>
        </Box>
      )}
      {numbers.map((num, index) => (
        <ButtonBase
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              handleChange(num);
            }
          }}
          key={index}
          role={undefined}
          tabIndex={-1}
          htmlFor={labelId + "-" + label + "-" + num}
          disabled={disabled}
          component={"label"}
          sx={(theme) => ({
            ...(num === localValue
              ? {
                  backgroundColor: theme.palette.background.paperInlayDarker,
                }
              : { backgroundColor: theme.palette.background.paper }),

            borderLeft:
              index !== 0 ? `1px solid ${theme.palette.divider}` : undefined,
            borderColor: theme.palette.divider,
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftWidth: index === 0 ? 1 : 0,
            borderTopRightRadius:
              index === numbers.length - 1 ? theme.shape.borderRadius : 0,
            borderBottomRightRadius:
              index === numbers.length - 1 ? theme.shape.borderRadius : 0,
            flexGrow: 1,
          })}
        >
          <Typography
            variant={"button"}
            color={(theme) => {
              if (num === localValue) {
                return theme.palette.text.primary;
              } else if (disabled) {
                return theme.palette.text.disabled;
              } else {
                return theme.palette.text.secondary;
              }
            }}
          >
            {num > 0 && "+"}
            {num}
          </Typography>

          <input
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              margin: "-1px",
              padding: 0,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              border: 0,
            }}
            disabled={disabled}
            value={num}
            type={"radio"}
            id={labelId + "-" + label + "-" + num}
            name={label}
            checked={num === localValue}
            onChange={(evt) => handleChange(num)}
          />
        </ButtonBase>
      ))}
    </Box>
  );
}
