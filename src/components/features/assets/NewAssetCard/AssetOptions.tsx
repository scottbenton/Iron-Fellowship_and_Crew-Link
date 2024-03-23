import { Datasworn } from "@datasworn/core";
import { AssetOption } from "./AssetOption";
import { Stack } from "@mui/material";
import { StoredAsset } from "types/Asset.type";

export interface AssetOptionsProps {
  asset: Datasworn.Asset;
  storedAsset?: StoredAsset;

  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
}

export function AssetOptions(props: AssetOptionsProps) {
  const { asset, storedAsset, onAssetOptionChange } = props;

  const assetOptions = asset.options;

  if (!assetOptions) {
    return null;
  }

  return (
    <Stack spacing={1} mt={0.5}>
      {Object.keys(assetOptions).map((assetOptionKey) => (
        <AssetOption
          storedAsset={storedAsset}
          key={assetOptionKey}
          assetOptionKey={assetOptionKey}
          assetOption={assetOptions[assetOptionKey]}
          onAssetOptionChange={onAssetOptionChange}
        />
      ))}
    </Stack>
  );
}
