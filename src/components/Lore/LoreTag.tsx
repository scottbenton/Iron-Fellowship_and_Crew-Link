import { Chip, ChipProps } from "@mui/material";
import { getHSLFromString } from "functions/getHueFromString";

export function LoreTag(props: ChipProps) {
  const { label } = props;

  const strLabel = typeof label === "string" ? label : "";

  const bgcolor = getHSLFromString(strLabel, 70, 80);
  const color = getHSLFromString(strLabel, 90, 20);

  return <Chip sx={{ bgcolor, color }} {...props} />;
}
