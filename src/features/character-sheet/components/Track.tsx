import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { useEffect, useState } from "react";

export interface TrackProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (newValue: number) => Promise<boolean>;
  sx?: SystemStyleObject;
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

  const handleChange = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
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
    <Box sx={sx} display={"flex"} flexDirection={"column"}>
      {label && (
        <Typography
          component={"label"}
          variant={"subtitle1"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          color={(theme) => theme.palette.text.secondary}
        >
          {label}
        </Typography>
      )}
      <ToggleButtonGroup
        exclusive
        disabled={disabled || loading}
        value={value}
        onChange={(evt, value) => handleChange(value)}
        sx={{
          width: "100%",
          display: "flex",
        }}
      >
        {numbers.map((num) => (
          <ToggleButton
            key={num}
            value={num}
            sx={{ py: 0, px: 1, flexGrow: 1 }}
          >
            {num > 0 && "+"}
            {num}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
