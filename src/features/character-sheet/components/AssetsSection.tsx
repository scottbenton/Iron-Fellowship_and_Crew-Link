import { Grid } from "@mui/material";
import { AssetCard } from "../../../components/AssetCard/AssetCard";
import { assets } from "../../../data/assets";
import { StoredAsset } from "../../../types/Asset.type";

export interface AssetsSectionProps {
  assetData: StoredAsset[];
}

export function AssetsSection(props: AssetsSectionProps) {
  const { assetData } = props;

  return (
    <Grid
      sx={(theme) => ({
        p: 2,
      })}
      container
      spacing={2}
    >
      {assetData.map((storedAsset, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          lg={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <AssetCard
            asset={assets[storedAsset.id]}
            sx={{
              // maxWidth: 380,
              minHeight: 450,
              width: "100%",
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
