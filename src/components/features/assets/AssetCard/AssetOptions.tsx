import { Datasworn } from "@datasworn-community/core";
import { AssetOption } from "./AssetOption";
import { Stack } from "@mui/material";
import { AssetDocument } from "api-calls/assets/_asset.type";

export interface AssetOptionsProps {
  storedAsset?: AssetDocument;
  options: Record<
    string,
    Datasworn.AssetOptionField | Datasworn.AssetAbilityOptionField
  >;

  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
}

export function AssetOptions(props: AssetOptionsProps) {
  const { options, storedAsset, onAssetOptionChange } = props;

  if (Object.keys(options).length === 0) {
    return null;
  }

  return (
    <Stack spacing={1} mt={0.5}>
      {Object.keys(options)
        .sort((o1, o2) => {
          const option1 = options[o1];
          const option2 = options[o2];

          return option1.label.localeCompare(option2.label);
        })
        .map((assetOptionKey) => (
          <AssetOption
            storedAsset={storedAsset}
            key={assetOptionKey}
            assetOptionKey={assetOptionKey}
            assetOption={options[assetOptionKey]}
            onAssetOptionChange={onAssetOptionChange}
          />
        ))}
    </Stack>
  );
}
