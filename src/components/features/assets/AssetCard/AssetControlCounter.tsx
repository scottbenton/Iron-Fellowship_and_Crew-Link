import { Datasworn } from "@datasworn-community/core";
import { Box, ButtonBase, Typography } from "@mui/material";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useStore } from "stores/store";
import AddIcon from "@mui/icons-material/Add";
import SubtractIcon from "@mui/icons-material/Remove";

export interface AssetControlCounterProps {
  value?: number;
  field: Datasworn.CounterField;
  onChange?: (value: number) => void;
}

export function AssetControlCounter(props: AssetControlCounterProps) {
  const { value, field, onChange } = props;

  const [localValue, setLocalValue] = useDebouncedState<number>(
    (value) => onChange && onChange(value),
    value ?? field.value,
    500
  );

  const announce = useStore((store) => store.appState.announce);

  const handleDecrement = () => {
    setLocalValue((prev) => {
      const newValue = prev - 1;
      if (typeof field.min === "number" && field.min > newValue) {
        announce(`Cannot decrease ${field.label} beyond ${field.max}`);
        return prev;
      }
      announce(`Decreased ${field.label} by 1 for a total of ${newValue}`);
      return newValue;
    });
  };

  const handleIncrement = () => {
    setLocalValue((prev) => {
      const newValue = prev + 1;
      if (typeof field.max === "number" && field.max < newValue) {
        announce(`Cannot increase ${field.label} beyond ${field.max}`);
        return prev;
      }
      announce(`Increased ${field.label} by 1 for a total of ${newValue}`);
      return newValue;
    });
  };

  return (
    <div>
      <Box
        display={"inline-flex"}
        alignItems={"stretch"}
        border={`1px solid`}
        borderColor={"divider"}
        borderRadius={1}
        overflow={"hidden"}
      >
        <Typography
          variant={"subtitle1"}
          fontFamily={(theme) => theme.fontFamilyTitle}
          sx={(theme) => ({
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.darkGrey.light
                : theme.palette.grey[400],
            color:
              theme.palette.mode === "light"
                ? theme.palette.darkGrey.contrastText
                : theme.palette.grey[800],
            px: 0.5,
          })}
        >
          {field.label}
        </Typography>
        {onChange && (
          <ButtonBase
            aria-label={`Decrement ${field.label}`}
            onClick={handleDecrement}
            sx={(theme) => ({
              bgcolor: theme.palette.mode === "light" ? "grey.300" : "grey.600",
              color: theme.palette.mode === "light" ? "grey.700" : "grey.200",
              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.shortest,
              }),
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "light" ? "grey.400" : "grey.700",
              },
            })}
          >
            <SubtractIcon />
          </ButtonBase>
        )}

        <Typography
          component={"p"}
          color={"textSecondary"}
          sx={{
            fontWeight: 600,
            alignSelf: "center",
            textAlign: "center",
            width: 64,
          }}
        >
          {localValue > 0 ? "+" : ""}
          {localValue}
        </Typography>
        {onChange && (
          <ButtonBase
            aria-label={`Increment ${field.label}`}
            onClick={handleIncrement}
            sx={(theme) => ({
              bgcolor: theme.palette.mode === "light" ? "grey.300" : "grey.600",
              color: theme.palette.mode === "light" ? "grey.700" : "grey.200",
              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.shortest,
              }),
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "light" ? "grey.400" : "grey.700",
              },
            })}
          >
            <AddIcon />
          </ButtonBase>
        )}
      </Box>
    </div>
  );
}
