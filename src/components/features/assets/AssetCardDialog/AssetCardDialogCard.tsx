import { Asset } from "dataforged";
import { AssetCard } from "../AssetCard/AssetCard";
import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

export interface AssetCardDialogCardProps {
  asset: Asset;
  selectAsset: () => void;
  searched: boolean;
  clearSearched: () => void;
  loading?: boolean;
}

export function AssetCardDialogCard(props: AssetCardDialogCardProps) {
  const { asset, selectAsset, searched, clearSearched, loading } = props;

  const assetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searched) {
      assetRef.current?.scrollIntoView({ behavior: "smooth" });
      clearSearched();
    }
  }, [clearSearched, searched]);

  return (
    <AssetCard
      ref={assetRef}
      assetId={asset.$id}
      readOnly
      showSharedIcon
      actions={
        <Button color={"inherit"} onClick={selectAsset} disabled={loading}>
          Select
        </Button>
      }
    />
  );
}
