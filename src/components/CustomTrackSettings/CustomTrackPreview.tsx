import { Box, Typography } from "@mui/material";
import { CustomTrack } from "components/CustomTrack";
import { StatComponent } from "components/StatComponent";
import { useState } from "react";
import { CustomTrack as ICustomTrack } from "types/CustomTrackSettings.type";

export interface CustomTrackPreviewProps {
  customTrack: ICustomTrack;
}

export function CustomTrackPreview(props: CustomTrackPreviewProps) {
  const { customTrack } = props;

  const [value, setValue] = useState<number>(
    customTrack.values.findIndex((cell) => cell.selectable)
  );

  return (
    <Box>
      <Typography variant={"overline"} sx={{ pt: 3 }}>
        Preview
      </Typography>
      <CustomTrack
        customTrack={customTrack}
        value={value}
        onChange={(value) => setValue(value)}
      />
      {customTrack.rollable &&
        typeof customTrack.values[value].value === "number" && (
          <StatComponent
            label={customTrack.label}
            value={customTrack.values[value].value as number}
            sx={{ mt: 2 }}
          />
        )}
    </Box>
  );
}
