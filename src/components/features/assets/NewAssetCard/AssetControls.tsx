import { Datasworn } from "@datasworn/core";
import { StoredAsset } from "types/Asset.type";
import { AssetControl } from "./AssetControl";
import { Stack } from "@mui/material";

export interface AssetControlsProps {
  controls: Record<string, Datasworn.AssetControlField> | undefined;
  storedAsset?: StoredAsset;
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
      {Object.keys(controls).map((controlId) => (
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
