import {
  Box,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ProgressTrackTick } from "components/features/ProgressTrack/ProgressTrackTick";
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckedIcon from "@mui/icons-material/CheckBox";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";

export interface LegacyTrackProps {
  label: string;
  value: number;
  checkedExperience: { [key: number]: boolean };
  onValueChange: (value: number) => void;
  onExperienceChecked: (index: number, checked: boolean) => void;
  isLegacy: boolean;
  onIsLegacyChecked: (checked: boolean) => void;
}

export function LegacyTrack(props: LegacyTrackProps) {
  const {
    label,
    value,
    checkedExperience,
    onValueChange,
    onExperienceChecked,
    isLegacy,
    onIsLegacyChecked,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const checks = [];
  let checksIndex = 0;
  let checksValue = 0;

  for (let i = 0; i <= 40; i++) {
    if (i % 4 === 0 && i !== 0) {
      checks[checksIndex] = checksValue;
      checksIndex++;
      checksValue = 0;
    }

    if (i < value) {
      checksValue++;
    }
  }

  return (
    <Box display={"flex"}>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant={"h6"}
            color={(theme) => theme.palette.text.primary}
            fontFamily={(theme) => theme.fontFamilyTitle}
            sx={{ mr: 4 }}
          >
            {label}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isLegacy}
                onChange={(evt, value) => onIsLegacyChecked(value)}
              />
            }
            label={"10"}
          />
        </Box>
        <Box
          display={"flex"}
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          }
        >
          <ButtonBase
            onClick={() => onValueChange(value > 0 ? value - 1 : 0)}
            sx={(theme) => ({
              height: isMobile ? 34 : 48,
              backgroundColor:
                theme.palette.darkGrey[
                  theme.palette.mode === "light" ? "main" : "light"
                ],
              color: theme.palette.darkGrey.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.darkGrey.dark,
              },
              borderTopLeftRadius: `${theme.shape.borderRadius}px`,
              borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            <MinusIcon />
          </ButtonBase>
          {checks.map((value, index) => (
            <Box key={index}>
              <Box
                sx={(theme) => ({
                  borderStyle: "solid",
                  borderColor: theme.palette.divider,
                  borderLeftColor:
                    index !== 0 ? theme.palette.divider : "transparent",
                  borderRightColor: "transparent",
                  borderWidth: 1,
                  width: isMobile ? 34 : 48,
                  height: isMobile ? 34 : 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <ProgressTrackTick
                  value={value}
                  key={index}
                  size={{ mobile: 32, desktop: 40 }}
                />
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                fontSize={isMobile ? 16 : 24}
              >
                <Checkbox
                  sx={{ p: 0 }}
                  icon={<UncheckedIcon fontSize={"inherit"} />}
                  checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                  disabled={value !== 4}
                  checked={checkedExperience[index * 2] ?? false}
                  onChange={(evt, checked) =>
                    onExperienceChecked(index * 2, checked)
                  }
                />
                {!isLegacy && (
                  <Checkbox
                    sx={{ p: 0 }}
                    icon={<UncheckedIcon fontSize={"inherit"} />}
                    checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                    disabled={value !== 4}
                    checked={checkedExperience[index * 2 + 1] ?? false}
                    onChange={(evt, checked) =>
                      onExperienceChecked(index * 2 + 1, checked)
                    }
                  />
                )}
              </Box>
            </Box>
          ))}
          <ButtonBase
            onClick={() => onValueChange(value < 40 ? value + 1 : 40)}
            sx={(theme) => ({
              height: isMobile ? 34 : 48,
              backgroundColor:
                theme.palette.darkGrey[
                  theme.palette.mode === "light" ? "main" : "light"
                ],
              color: theme.palette.darkGrey.contrastText,
              px: 0.5,
              "&:hover": {
                backgroundColor: theme.palette.darkGrey.dark,
              },
              borderTopRightRadius: `${theme.shape.borderRadius}px`,
              borderBottomRightRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            <PlusIcon />
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}
