import { Datasworn } from "@datasworn/core";
import { Box, Collapse } from "@mui/material";
import { CollapsibleSectionHeader } from "components/features/charactersAndCampaigns/CollapsibleSectionHeader";
import { useState } from "react";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { OracleTablesCollectionSubList } from "./OracleTablesCollectionSubList";
import { extraOracleCollectionActionsProp } from "./oracleCollectionActions";
import { CollectionActions } from "./CollectionActions";
import { useStore } from "stores/store";

export interface OracleTablesCollectionItemProps {
  collectionKey: string;
  collection: Datasworn.OracleTablesCollection;
  labelPrefix?: string;
  listItemActions?: extraOracleListItemActionsProp;
  collectionActions?: extraOracleCollectionActionsProp;
  disabled?: boolean;
  rollOnRowClick: boolean;
}

export function OracleTablesCollectionItem(
  props: OracleTablesCollectionItemProps
) {
  const {
    collectionKey,
    collection,
    labelPrefix,
    listItemActions,
    collectionActions,
    disabled,
    rollOnRowClick,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const title = labelPrefix
    ? `${labelPrefix} ꞏ ${collection.name}`
    : collection.name;

  const oracleCollectionMap = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );

  const enhancingCollections = Object.values(oracleCollectionMap).filter(
    (c) => {
      return c.enhances === collection.id;
    }
  );

  const oracleIds = Object.values(collection.contents ?? {}).map((c) => c.id);
  const subCollectionIds = Object.values(collection.collections ?? {}).map(
    (c) => c.id
  );

  enhancingCollections.forEach((enhancingCollection) => {
    if (enhancingCollection.contents) {
      Object.values(enhancingCollection.contents).forEach((table) => {
        oracleIds.push(table.id);
      });
    }
    if (
      enhancingCollection.oracle_type === "tables" &&
      enhancingCollection.collections
    ) {
      Object.values(enhancingCollection.collections).forEach((collection) => {
        subCollectionIds.push(collection.id);
      });
    }
  });

  return (
    <Box component={"li"}>
      <CollapsibleSectionHeader
        component={"span"}
        key={collectionKey}
        text={title}
        open={isExpanded}
        toggleOpen={() => setIsExpanded((prevValue) => !prevValue)}
        disabled={disabled}
        actions={
          <CollectionActions
            collection={collection}
            disabled={disabled}
            collectionActions={collectionActions}
          />
        }
      />
      <Collapse in={isExpanded}>
        <OracleTablesCollectionSubList
          oracleIds={oracleIds}
          subCollectionIds={subCollectionIds}
          collectionPrefixLabel={title}
          disabled={!isExpanded || disabled}
          actions={listItemActions}
          sx={{ mb: 0.5 }}
          rollOnRowClick={rollOnRowClick}
        />
      </Collapse>
    </Box>
  );
}
