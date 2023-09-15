import {
  Box,
  Card,
  MenuItem,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useField } from "formik";
import { useState } from "react";
import { Stat } from "types/stats.enum";

export interface StatInputProps {
  label: string;
  stat: Stat;

  remainingOptions: number[];
  handleRemainingOptionsChange: (
    previousValue: number | undefined,
    newValue: number | undefined
  ) => void;

  allowAnyNumber?: boolean;

  sx?: SxProps;
}

export function StatInput(props: StatInputProps) {
  const {
    stat,
    label,
    remainingOptions,
    handleRemainingOptionsChange,
    allowAnyNumber,
    sx,
  } = props;

  const [field, meta, handlers] = useField<number | undefined>({
    name: `stats.${stat}`,
  });
  const value = field.value;

  const handleInputChange = (value: string) => {
    if (!value) {
      handlers.setValue(undefined);
    } else {
      const numValue = parseInt(value);
      if (!Number.isNaN(numValue)) {
        handlers.setValue(numValue);
      }
    }
  };

  const handleSelectChange = (value: string | number) => {
    const currentValue = field.value as number | undefined;
    const numValue = typeof value === "string" ? parseInt(value) : value;
    const finalValue = numValue > 0 ? numValue : undefined;
    handleRemainingOptionsChange(currentValue, finalValue);

    handlers.setValue(finalValue);
  };

  return (
    <Card
      variant={"outlined"}
      sx={[
        (theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          mr: 1,
          mt: 1,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        display={"block"}
        textAlign={"center"}
        variant={"subtitle1"}
        component={"label"}
        htmlFor={label}
        sx={(theme) => ({
          fontFamily: theme.fontFamilyTitle,
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.paperInlay,
        })}
      >
        {label}
      </Typography>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        {allowAnyNumber ? (
          <TextField
            color={"primary"}
            id={label}
            variant={"outlined"}
            value={value ?? ""}
            onChange={(evt) => handleInputChange(evt.target.value)}
            sx={{ width: 100 }}
            inputProps={{ inputMode: "numeric" }}
          />
        ) : (
          <TextField
            id={label}
            select
            color={"primary"}
            variant={"outlined"}
            value={value ?? -1}
            onChange={(evt) => handleSelectChange(evt.target.value)}
            sx={{ width: 100 }}
          >
            <MenuItem value={-1}>--</MenuItem>
            {value !== undefined && <MenuItem value={value}>{value}</MenuItem>}
            {remainingOptions.map((option, index) => (
              <MenuItem value={option} key={index}>
                {`${option}`}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </Card>
  );
}
