import { Typography } from "@mui/material";
import { Track } from "components/features/Track";
import { StatComponent } from "components/features/characters/StatComponent";
import { Control, useWatch } from "react-hook-form";
import { Form } from "./ConditionMeterDialogForm";

export interface ConditionMeterPreviewProps {
  control: Control<Form, unknown>;
}

export function ConditionMeterPreview(props: ConditionMeterPreviewProps) {
  const { control } = props;

  const label = useWatch({ control, name: "label" });
  const min = useWatch({ control, name: "min" });
  const max = useWatch({ control, name: "max" });
  const defaultValue = useWatch({ control, name: "defaultValue" });
  const rollable = useWatch({ control, name: "rollable" });

  if (
    !label ||
    min === undefined ||
    max === undefined ||
    defaultValue === undefined
  ) {
    return <Typography>Waiting for input...</Typography>;
  }

  return (
    <>
      <Track label={label} value={defaultValue} min={min} max={max} />
      {rollable && (
        <StatComponent label={label} value={defaultValue} disableRoll />
      )}
    </>
  );
}
