import { AssetCard } from "../NewAssetCard/AssetCard";
import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

export interface AssetCardDialogCardProps {
  assetId: string;
  selectAsset: () => void;
  searched: boolean;
  clearSearched: () => void;
  loading?: boolean;
}

export function AssetCardDialogCard(props: AssetCardDialogCardProps) {
  const { assetId, selectAsset, searched, clearSearched, loading } = props;

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
      assetId={assetId}
      showSharedIcon
      actions={
        <Button color={"inherit"} onClick={selectAsset} disabled={loading}>
          Select
        </Button>
      }
    />
  );
}
