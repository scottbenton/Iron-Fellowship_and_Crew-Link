import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

export type NumberFieldProps = {
  value: number;
  onChange: (value?: number) => void;
} & TextFieldProps;

export function NumberField(props: NumberFieldProps) {
  const { value, onChange, ...textFieldProps } = props;

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const numericValue = evt.currentTarget.value.replace(/\D/g, "");
    numericValue ? onChange(parseInt(numericValue)) : onChange(undefined);
  };

  return (
    <TextField
      value={value ?? ""}
      onChange={(evt) => {
        handleChange(evt);
      }}
      {...textFieldProps}
    />
  );
}
