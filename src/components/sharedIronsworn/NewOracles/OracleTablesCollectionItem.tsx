import { OracleTablesCollection } from "@datasworn/core";
import { Box, Collapse } from "@mui/material";
import { CollapsibleSectionHeader } from "components/features/charactersAndCampaigns/CollapsibleSectionHeader";
import { useState } from "react";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { OracleTablesCollectionSubList } from "./OracleTablesCollectionSubList";
import { extraOracleCollectionActionsProp } from "./oracleCollectionActions";
import { CollectionActions } from "./CollectionActions";

export interface OracleTablesCollectionItemProps {
  homebrewIds?: string[];
  collectionKey: string;
  collection: OracleTablesCollection;
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
    homebrewIds,
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

  const oracleIds = Object.values(collection.contents ?? {}).map((c) => c.id);
  const subCollectionIds = Object.values(collection.collections ?? {}).map(
    (c) => c.id
  );

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
          homebrewIds={homebrewIds}
          oracleIds={oracleIds}
          subCollectionIds={subCollectionIds}
          collectionPrefixLabel={title}
          disabled={!isExpanded}
          actions={listItemActions}
          sx={{ mb: 0.5 }}
          rollOnRowClick={rollOnRowClick}
        />
      </Collapse>
    </Box>
  );
}
