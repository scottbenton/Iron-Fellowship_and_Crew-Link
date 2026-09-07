import { Datasworn } from "@datasworn-community/core";
import { Box, Typography } from "@mui/material";
import { DebouncedClockCircle } from "components/features/charactersAndCampaigns/Clocks/DebouncedClockCircle";

export interface AssetControlClockProps {
  value?: number;
  field: Datasworn.ClockField;
  onChange?: (value: number) => void;
}

export function AssetControlClock(props: AssetControlClockProps) {
  const { value, field, onChange } = props;

  return (
    <Box>
      <Typography
        variant={"subtitle1"}
        fontFamily={(theme) => theme.fontFamilyTitle}
        color={"textSecondary"}
      >
        {field.label}
      </Typography>

      <DebouncedClockCircle
        value={value ?? 0}
        segments={field.max}
        onFilledSegmentsChange={onChange}
        voiceLabel={field.label}
        size={"small"}
      />
    </Box>
  );
}
