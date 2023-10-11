import { Box, Typography } from "@mui/material";
import { ChangeEvent, HTMLAttributes, useState } from "react";

export interface EditableTitleProps extends HTMLAttributes<HTMLInputElement> {
  srLabel: string;
  readOnly: boolean;
  value: string;
}

export function EditableTitle(props: EditableTitleProps) {
  const { srLabel, readOnly, defaultValue, value, onChange, ...inputProps } =
    props;

  const [tempValue, setTempValue] = useState<string>(value);
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(evt);
    setTempValue(evt.currentTarget.value);
  };

  if (readOnly) {
    return (
      <Typography
        variant={"h4"}
        component={"h1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {tempValue}
      </Typography>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        "&>input": {
          all: "unset",
          ...theme.typography.h4,
          fontFamily: theme.fontFamilyTitle,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "transparent",
          borderRadius: `${theme.shape.borderRadius}px`,
          p: 1,
          mx: -1,
          display: "flex",
          "&:hover": {
            borderColor: theme.palette.grey[400],
          },
          "&:focus": {
            borderWidth: 2,
            borderColor: theme.palette.primary.main,
          },
          width: tempValue.length + "ch",
        },
      })}
    >
      <input
        value={tempValue}
        onChange={handleChange}
        aria-label="srLabel"
        {...inputProps}
      />
    </Box>
  );
}
