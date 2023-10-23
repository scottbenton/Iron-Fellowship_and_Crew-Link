import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { useEffect, useState } from "react";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);

  const handleChange = (newValue: number | undefined) => {
    if (typeof newValue === "number" && newValue >= min && newValue <= max) {
      setLoading(true);
      onChange(newValue)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setNumbers(getArr(min, max));
  }, [min, max]);

  return (
    <Box sx={sx} display={"flex"} overflow={"auto"}>
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
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={(theme) => ({
            borderTopLeftRadius: `${theme.shape.borderRadius}px`,
            borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
          })}
        >
          <Typography
            fontFamily={(theme) => theme.fontFamilyTitle}
            variant={"subtitle1"}
          >
            {label}
          </Typography>
        </Box>
      )}
      <ToggleButtonGroup
        exclusive
        disabled={disabled || loading}
        value={value}
        onChange={(evt, value) => handleChange(value)}
        sx={(theme) => ({
          width: "100%",
          display: "flex",
          bgcolor: theme.palette.background.paper,
        })}
      >
        {numbers.map((num, index) => (
          <ToggleButton
            key={num}
            value={num}
            sx={[
              { py: 0, px: 0.5, flexGrow: 1 },
              label && index === 0
                ? {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderLeftWidth: 0,
                  }
                : {},
            ]}
          >
            {num > 0 && "+"}
            {num}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
