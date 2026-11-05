import { Box, Typography } from "@mui/material";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useStore } from "stores/store";
import { HomebrewAssetCollectionDocument } from "api-calls/homebrew/assets/collections/_homebrewAssetCollection.type";

export interface AssetCollectionCardProps {
  collection: HomebrewAssetCollectionDocument;
}

export function AssetCollectionCard(props: AssetCollectionCardProps) {
  const { collection } = props;

  const assetCollectionMap = useStore(
    (store) => store.rules.assetMaps.nonReplacedAssetCollectionMap
  );

  return (
    <>
      <Box alignSelf={"start"}>
        <Typography variant={"overline"} color={"textSecondary"}>
          Category
        </Typography>
        <Typography variant={"h6"} component={"span"} display={"block"}>
          {collection.label}
        </Typography>
        {collection.replacesId && (
          <Typography color={"textSecondary"}>
            Replaces &quot;
            {assetCollectionMap[collection.replacesId]?.name ??
              collection.replacesId}
            &quot;
          </Typography>
        )}
        {collection.enhancesId && (
          <Typography color={"textSecondary"}>
            Enhances &quot;
            {assetCollectionMap[collection.enhancesId]?.name ??
              collection.enhancesId}
            &quot;
          </Typography>
        )}
      </Box>
      <ChevronRight color={"action"} />
    </>
  );
}
