import { Datasworn } from "@datasworn/core";
import { AssetOption } from "./AssetOption";
import { Stack } from "@mui/material";

export interface AssetOptionsProps {
  asset: Datasworn.Asset;

  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
}

export function AssetOptions(props: AssetOptionsProps) {
  const { asset, onAssetOptionChange } = props;

  const assetOptions = asset.options;

  if (!assetOptions) {
    return null;
  }

  return (
    <Stack spacing={1} mt={0.5}>
      {Object.keys(assetOptions).map((assetOptionKey) => (
        <AssetOption
          key={assetOptionKey}
          assetOptionKey={assetOptionKey}
          assetOption={assetOptions[assetOptionKey]}
          onAssetOptionChange={onAssetOptionChange}
        />
      ))}
    </Stack>
  );
}
