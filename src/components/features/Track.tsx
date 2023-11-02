import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  SxProps,
  Theme,
  ButtonBase,
} from "@mui/material";
import { useEffect, useId, useState } from "react";

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

  const labelId = useId();

  return (
    <>
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
              id={labelId}
              component={"p"}
            >
              {label}
            </Typography>
          </Box>
        )}
        <ToggleButtonGroup
          aria-labelledby={labelId}
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
      <Box
        component={"fieldset"}
        sx={sx}
        display={"flex"}
        overflow={"auto"}
        border={"unset"}
        p={0}
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
              id={labelId}
              component={"legend"}
            >
              {label}
            </Typography>
          </Box>
        )}
        <Box
          width={"100%"}
          display={"flex"}
          bgcolor={"background.paper"}
          border={(theme) => `1px solid ${theme.palette.divider}`}
          sx={(theme) => ({
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            overflow: "hidden",
          })}
        >
          {numbers.map((num, index) => (
            <ButtonBase
              onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled) {
                  handleChange(num);
                }
              }}
              role={undefined}
              htmlFor={label + "-" + num}
              disabled={disabled}
              component={"label"}
              sx={(theme) => ({
                ...(num === value
                  ? {
                      backgroundColor:
                        theme.palette.background.paperInlayDarker,
                    }
                  : {}),

                borderLeft:
                  index !== 0
                    ? `1px solid ${theme.palette.divider}`
                    : undefined,

                flexGrow: 1,
                "&>input": {
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  margin: "-1px",
                  padding: 0,
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  border: 0,
                },
              })}
            >
              <input
                disabled={disabled}
                value={num}
                type={"radio"}
                id={label + "-" + num}
                name={label}
                checked={num === value}
                onChange={(evt) => handleChange(num)}
              />
              <Typography
                variant={"button"}
                color={(theme) =>
                  num === value
                    ? "textPrimary"
                    : disabled
                    ? theme.palette.text.disabled
                    : "textSecondary"
                }
              >
                {num > 0 && "+"}
                {num}
              </Typography>
            </ButtonBase>
          ))}
        </Box>
      </Box>
    </>
  );
}
