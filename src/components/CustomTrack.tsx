import {
  Box,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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
  const { sx, customTrack, value, onChange, disabled, loading } = props;
  return (
    <Box sx={sx} display={"flex"} overflow={"auto"}>
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
        >
          {customTrack.label}
        </Typography>
      </Box>
      <ToggleButtonGroup
        exclusive
        disabled={disabled || loading}
        value={value}
        onChange={(evt, value) => onChange(value)}
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
              {typeof cell.value === "number" && cell.value < 0 && "+"}
              {cell.value}
            </ToggleButton>
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
      </ToggleButtonGroup>
    </Box>
  );
}
