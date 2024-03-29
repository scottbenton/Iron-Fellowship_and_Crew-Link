import {
  Box,
  Card,
  MenuItem,
  SxProps,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import HelpIcon from "@mui/icons-material/Help";

export interface StatInputProps {
  label: string;
  description?: string;
  value?: number;
  updateValue: (value?: number) => void;

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
    label,
    description,
    value,
    updateValue,
    remainingOptions,
    handleRemainingOptionsChange,
    allowAnyNumber,
    sx,
  } = props;

  const handleInputChange = (value: string) => {
    if (!value) {
      updateValue(undefined);
    } else {
      const numValue = parseInt(value);
      if (!Number.isNaN(numValue)) {
        updateValue(numValue);
      }
    }
  };

  const handleSelectChange = (newValue: string | number) => {
    const currentValue = value as number | undefined;
    const numValue =
      typeof newValue === "string" ? parseInt(newValue) : newValue;
    const finalValue = numValue > 0 ? numValue : undefined;
    handleRemainingOptionsChange(currentValue, finalValue);

    updateValue(finalValue);
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
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          color={"textSecondary"}
          bgcolor={"background.paperInlay"}
          px={1}
        >
          <Typography
            display={"block"}
            variant={"subtitle1"}
            component={"label"}
            htmlFor={label}
            sx={(theme) => ({
              fontFamily: theme.fontFamilyTitle,
            })}
          >
            {label}
          </Typography>
          {description && (
            <Tooltip
              PopperProps={{
                sx: (theme) => ({
                  [`& .${tooltipClasses.tooltip}`]: {
                    backgroundColor: theme.palette.background.paper,
                    maxWidth: theme.spacing(24),
                    border: `1px solid ${theme.palette.divider}`,
                  },
                }),
              }}
              title={<MarkdownRenderer markdown={description} />}
            >
              <HelpIcon color={"info"} />
            </Tooltip>
          )}
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        {allowAnyNumber ? (
          <TextField
            color={"primary"}
            id={label}
            variant={"outlined"}
            value={value ?? ""}
            onChange={(evt) => handleInputChange(evt.target.value)}
            sx={{
              width: 100,
              "& .MuiOutlinedInput-root": {
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
              },
            }}
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
            sx={{
              width: 100,
              "& .MuiOutlinedInput-root": {
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
              },
            }}
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
