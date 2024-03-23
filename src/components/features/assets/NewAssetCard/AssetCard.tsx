import { Box, Card, Stack, SxProps, Theme } from "@mui/material";
import { StoredAsset } from "types/Asset.type";
import { useStore } from "stores/store";
import { AssetOptions } from "./AssetOptions";
import { AssetAbilities } from "./AssetAbilities";
import { AssetControls } from "./AssetControls";
import { AssetHeader } from "./AssetHeader";
import { AssetNameAndDescription } from "./AssetNameAndDescription";
import { ForwardedRef, ReactNode, forwardRef } from "react";

export interface AssetCardProps {
  assetId: string;
  storedAsset?: StoredAsset;
  actions?: ReactNode;

  onAssetRemove?: () => void;
  onAssetAbilityToggle?: (abilityIndex: number, checked: boolean) => void;
  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
  onAssetControlChange?: (
    controlKey: string,
    value: boolean | string | number
  ) => void;

  showSharedIcon?: boolean;
  sx?: SxProps<Theme>;
}

const AssetCardComponent = (
  props: AssetCardProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const {
    assetId,
    storedAsset,
    actions,
    onAssetRemove,
    onAssetAbilityToggle,
    onAssetOptionChange,
    onAssetControlChange,
    showSharedIcon,
    sx,
  } = props;

  const assetMap = useStore((store) => store.rules.assetMaps.assetMap);

  const asset = assetMap[assetId];

  if (!asset) {
    return null;
  }

  return (
    <Card
      ref={ref}
      variant={"outlined"}
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderWidth: 0,
        ...sx,
      }}
    >
      <AssetHeader asset={asset} onAssetRemove={onAssetRemove} />
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        p={1}
        border={(theme) => `1px solid ${theme.palette.divider}`}
        sx={(theme) => ({
          borderBottomLeftRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
        })}
      >
        <AssetNameAndDescription
          asset={asset}
          showSharedIcon={showSharedIcon}
        />
        <AssetOptions
          asset={asset}
          storedAsset={storedAsset}
          onAssetOptionChange={onAssetOptionChange}
        />
        <AssetAbilities
          asset={asset}
          storedAsset={storedAsset}
          onAbilityToggle={onAssetAbilityToggle}
        />
        <AssetControls
          controls={asset.controls}
          storedAsset={storedAsset}
          onControlChange={onAssetControlChange}
        />
        {actions && (
          <Stack
            direction={"row"}
            spacing={1}
            mt={2}
            justifyContent={"flex-end"}
          >
            {actions}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export const AssetCard = forwardRef<HTMLDivElement, AssetCardProps>(
  AssetCardComponent
);
