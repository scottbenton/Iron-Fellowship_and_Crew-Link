import { Box, ButtonBase, SxProps, Theme, Typography } from "@mui/material";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useEffect, useId, useRef } from "react";
import { useStore } from "stores/store";
import { CustomTrack as ICustomTrack } from "types/CustomTrackSettings.type";

export interface CustomTrackProps {
  customTrack: ICustomTrack;
  value?: number;
  onChange: (index: number) => void;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  loading?: boolean;
}

export function CustomTrack(props: CustomTrackProps) {
  const { sx, customTrack, value, onChange, disabled } = props;

  const hasUnsavedChangesRef = useRef(false);
  const announce = useStore((store) => store.appState.announce);

  const [localIndex, setLocalIndex] = useDebouncedState(
    (newValue) => {
      if (newValue && newValue !== value) {
        hasUnsavedChangesRef.current = false;
        onChange(newValue);
      }
    },
    value,
    500
  );

  const handleChange = (newValue: number) => {
    hasUnsavedChangesRef.current = true;
    setLocalIndex(newValue);
  };

  useEffect(() => {
    if (value && value !== localIndex && !hasUnsavedChangesRef.current) {
      setLocalIndex(value);
      announce(
        `${customTrack.label} was updated to ${customTrack.values[value].value}`
      );
    }
  }, [localIndex, setLocalIndex, value, customTrack, announce]);
  const labelId = useId();

  return (
    <Box
      sx={sx}
      display={"flex"}
      overflow={"auto"}
      role={"group"}
      component={"div"}
      aria-labelledby={labelId}
    >
      <Box
        flexShrink={0}
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
          borderTopLeftRadius: theme.shape.borderRadius,
          borderBottomLeftRadius: theme.shape.borderRadius,
        })}
      >
        <Typography
          fontFamily={(theme) => theme.fontFamilyTitle}
          variant={"subtitle1"}
          id={labelId}
        >
          {customTrack.label}
        </Typography>
      </Box>
      {customTrack.values.map((cell, index) =>
        cell.selectable ? (
          <ButtonBase
            key={index}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !disabled) {
                handleChange(index);
              }
            }}
            role={undefined}
            tabIndex={-1}
            htmlFor={labelId + "-" + cell + "-" + index}
            disabled={disabled}
            component={"label"}
            sx={(theme) => ({
              ...(index === localIndex
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
                index === customTrack.values.length - 1
                  ? theme.shape.borderRadius
                  : 0,
              borderBottomRightRadius:
                index === customTrack.values.length - 1
                  ? theme.shape.borderRadius
                  : 0,
              flexGrow: 1,
            })}
          >
            <Typography
              variant={"button"}
              color={(theme) => {
                if (index === localIndex) {
                  return theme.palette.text.primary;
                } else if (disabled) {
                  return theme.palette.text.disabled;
                } else {
                  return theme.palette.text.secondary;
                }
              }}
            >
              {typeof cell.value === "number" && cell.value > 0 && "+"}
              {cell.value}
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
              value={index}
              type={"radio"}
              id={labelId + "-" + cell + "-" + index}
              name={customTrack.label}
              checked={index === localIndex}
              onChange={() => handleChange(index)}
            />
          </ButtonBase>
        ) : (
          <Box
            key={index}
            sx={(theme) => ({
              borderStyle: "solid",
              borderColor: theme.palette.divider,
              borderWidth: 1,
              borderLeftWidth: 0,
              px: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.grey[500],
              color: theme.palette.darkGrey.contrastText,
              borderTopRightRadius:
                index === customTrack.values.length - 1
                  ? theme.shape.borderRadius
                  : 0,
              borderBottomRightRadius:
                index === customTrack.values.length - 1
                  ? theme.shape.borderRadius
                  : 0,
            })}
          >
            <Typography
              fontFamily={(theme) => theme.fontFamilyTitle}
              variant={"subtitle1"}
            >
              {cell.value}
            </Typography>
          </Box>
        )
      )}
      {/* <ToggleButtonGroup
        exclusive
        disabled={disabled || loading}
        value={value}
        onChange={(evt, newValue) => {
          if (newValue !== undefined && newValue !== null) {
            onChange(newValue);
          }
        }}
        sx={[
          {
            width: "100%",
            display: "flex",
          },
        ]}
      >
        {customTrack.values.map((cell, index) =>
          cell.selectable ? (
            <ToggleButton
              key={index}
              value={index}
              sx={[
                { py: 0, px: 0.5, flexGrow: 1 },
                index === 0
                  ? {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeftWidth: 0,
                    }
                  : {},
              ]}
            >
              {typeof cell.value === "number" && cell.value > 0 && "+"}
              {cell.value}
            </ToggleButton>
          ) : (
            <FakeToggleButton key={index} value={cell.value}>
              {cell.value}
            </FakeToggleButton>
          )
        )}
      </ToggleButtonGroup> */}
    </Box>
  );
}
