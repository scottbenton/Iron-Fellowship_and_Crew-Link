import { Datasworn } from "@datasworn-community/core";
import { Chip, Stack } from "@mui/material";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";

export interface MoveAssetControlProps {
  move: Datasworn.Move;
  control: string;
}

export function MoveAssetControl(props: MoveAssetControlProps) {
  const { control, move } = props;

  const isInCharacterSheet = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );

  const characterAssets = useStore(
    (store) => store.characters.currentCharacter.assets.assets
  );
  const campaignAssets = useStore(
    (store) => store.campaigns.currentCampaign.assets.assets
  );

  const assetMap = useStore((store) => store.rules.assetMaps.assetMap);

  if (!isInCharacterSheet) {
    return <Chip label={control} sx={{ textTransform: "capitalize" }} />;
  }

  const matchingAssets: { values: AssetDocument; asset: Datasworn.Asset }[] =
    [];
  Object.values({ ...characterAssets, ...campaignAssets }).forEach(
    (storedAsset) => {
      const asset = assetMap[storedAsset.id];
      if (asset) {
        if (asset.controls?.[control]?.field_type === "condition_meter") {
          matchingAssets.push({ values: storedAsset, asset });
        }
      }
    }
  );

  const getAssetValue = (asset: Datasworn.Asset, values: AssetDocument) => {
    const storedValue = values.controlValues?.[control];
    if (typeof storedValue === "number") {
      return storedValue;
    }
    const defaultValue = asset.controls?.[control]?.value;
    if (typeof defaultValue === "number") {
      return defaultValue;
    }
    return 0;
  };

  if (matchingAssets.length > 0) {
    return (
      <Stack direction={"row"} spacing={1}>
        {matchingAssets.map((asset, index) => (
          <StatComponent
            key={index}
            label={asset.values.optionValues?.name ?? asset.asset.name}
            value={getAssetValue(asset.asset, asset.values)}
            moveInfo={{
              name: move.name,
              id: move._id,
            }}
          />
        ))}
      </Stack>
    );
  }

  return <Chip label={control} sx={{ textTransform: "capitalize" }} />;
}
