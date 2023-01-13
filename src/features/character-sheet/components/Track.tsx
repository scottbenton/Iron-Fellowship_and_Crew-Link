import {
  Box,
  ButtonBase,
  Card,
  Hidden,
  Input,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { useEffect, useState } from "react";

import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";

export interface TrackProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (newValue: number) => Promise<boolean>;
  sx?: SystemStyleObject;
}

function getArr(min: number, max: number): number[] {
  let arr: number[] = [];

  for (let i = min; i <= max; i++) {
    arr.push(i);
  }

  return arr;
}

export function Track(props: TrackProps) {
  const { label, min, max, value, onChange, sx } = props;

  const [inputValue, setInputValue] = useState(value + "");
  const [loading, setLoading] = useState<boolean>(false);

  const [numbers, setNumbers] = useState<number[]>([]);

  const handleChange = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
      setLoading(true);
      setInputValue(newValue + "");
      onChange(newValue)
        .catch(() => {
          setInputValue(value + "");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setInputValue(value + "");
    }
  };

  const handleBlur = () => {
    const intInputValue = parseInt(inputValue);

    handleChange(intInputValue);
  };

  useEffect(() => {
    setNumbers(getArr(min, max));
  }, [min, max]);

  return (
    <Box sx={sx} display={"flex"} flexDirection={"column"}>
      <Typography
        component={"label"}
        htmlFor={label + "-track-input"}
        variant={"subtitle1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
        color={(theme) => theme.palette.text.secondary}
      >
        {label}
      </Typography>
      <ToggleButtonGroup
        exclusive
        disabled={loading}
        value={value}
        onChange={(evt, value) => handleChange(value)}
      >
        {numbers.map((num) => (
          <ToggleButton key={num} value={num} sx={{ py: 0, px: 1 }}>
            {num}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
