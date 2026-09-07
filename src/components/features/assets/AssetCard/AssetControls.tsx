import { Datasworn } from "@datasworn-community/core";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetControl } from "./AssetControl";
import { Stack } from "@mui/material";

export interface AssetControlsProps {
  controls:
    | Record<
        string,
        Datasworn.AssetControlField | Datasworn.AssetAbilityControlField
      >
    | undefined;
  storedAsset?: AssetDocument;
  row?: boolean;
  onControlChange?: (
    controlKey: string,
    value: boolean | string | number
  ) => void;
}
export function AssetControls(props: AssetControlsProps) {
  const { controls, row, storedAsset, onControlChange } = props;

  if (!controls) {
    return null;
  }

  return (
    <Stack
      direction={row ? "row" : "column"}
      spacing={row ? 1 : 2}
      sx={{ mt: row ? 0 : 2 }}
    >
      {Object.keys(controls)
        .sort((c1, c2) => {
          const control1 = controls[c1];
          const control2 = controls[c2];

          return control1.label.localeCompare(control2.label);
        })
        .map((controlId) => (
          <AssetControl
            key={controlId}
            controlId={controlId}
            control={controls[controlId]}
            storedAsset={storedAsset}
            onControlChange={onControlChange}
          />
        ))}
    </Stack>
  );
}
