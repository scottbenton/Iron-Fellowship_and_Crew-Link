import { OracleTablesCollection } from "@datasworn/core";
import { Box, Collapse } from "@mui/material";
import { CollapsibleSectionHeader } from "components/features/charactersAndCampaigns/CollapsibleSectionHeader";
import { useState } from "react";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { OracleTablesCollectionSubList } from "./OracleTablesCollectionSubList";

export interface OracleTablesCollectionItemProps {
  collectionKey: string;
  collection: OracleTablesCollection;
  labelPrefix?: string;
  listItemActions?: extraOracleListItemActionsProp;
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
    disabled,
    rollOnRowClick,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const title = labelPrefix
    ? `${labelPrefix} ꞏ ${collection.name}`
    : collection.name;

  return (
    <Box component={"li"}>
      <CollapsibleSectionHeader
        component={"span"}
        key={collectionKey}
        text={title}
        open={isExpanded}
        toggleOpen={() => setIsExpanded((prevValue) => !prevValue)}
        disabled={disabled}
      />
      <Collapse in={isExpanded}>
        <OracleTablesCollectionSubList
          oracles={collection.contents ?? {}}
          subCollections={collection.collections ?? {}}
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
