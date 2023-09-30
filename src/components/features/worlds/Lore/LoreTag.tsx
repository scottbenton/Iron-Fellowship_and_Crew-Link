import { Chip, ChipProps } from "@mui/material";
import { getHSLFromString } from "functions/getHueFromString";

export function LoreTag(props: ChipProps) {
  const { label } = props;

  const strLabel = typeof label === "string" ? label : "";

  const lightColor = getHSLFromString(strLabel, 70, 80);
  const darkColor = getHSLFromString(strLabel, 90, 15);

  return (
    <Chip
      sx={(theme) =>
        theme.palette.mode === "light"
          ? { bgcolor: lightColor, color: darkColor }
          : { bgcolor: darkColor, color: lightColor }
      }
      {...props}
    />
  );
}
