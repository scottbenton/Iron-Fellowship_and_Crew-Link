import { Datasworn } from "@datasworn/core";
import { List, SxProps } from "@mui/material";
import { OracleRollableListItem } from "./OracleRollableListItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { OracleRollableCollectionListItem } from "./OracleRollableCollectionListItem";
import { OracleTablesCollectionItem } from "./OracleTablesCollectionItem";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";
import { useOracleRollableMap } from "data/hooks/useOracleRollableMap";
import { extraOracleCollectionActionsProp } from "./oracleCollectionActions";

export interface OracleTablesCollectionSubListProps {
  homebrewIds?: string[];
  oracleIds: string[];
  subCollectionIds: string[];
  actions?: extraOracleListItemActionsProp;
  collectionActions?: extraOracleCollectionActionsProp;
  disabled?: boolean;
  collectionPrefixLabel?: string;
  sx?: SxProps;
  rollOnRowClick: boolean;
}

export function OracleTablesCollectionSubList(
  props: OracleTablesCollectionSubListProps
) {
  const {
    homebrewIds,
    oracleIds,
    subCollectionIds,
    actions,
    collectionActions,
    disabled,
    collectionPrefixLabel,
    sx,
    rollOnRowClick,
  } = props;

  const collections = useOracleCollectionMap(homebrewIds);
  const rollables = useOracleRollableMap(homebrewIds);

  const rollableSubCollections: Record<
    string,
    | Datasworn.OracleTableSharedRolls
    | Datasworn.OracleTableSharedDetails
    | Datasworn.OracleTableSharedResults
  > = {};
  const nonRollableSubCollections: Record<
    string,
    Datasworn.OracleTablesCollection
  > = {};

  subCollectionIds.forEach((subCollectionKey) => {
    const subCollection = collections[subCollectionKey];
    if (subCollection.oracle_type === "tables") {
      nonRollableSubCollections[subCollectionKey] = subCollection;
    } else if (
      subCollection.oracle_type === "table_shared_rolls" ||
      subCollection.oracle_type === "table_shared_details" ||
      subCollection.oracle_type === "table_shared_results"
    ) {
      rollableSubCollections[subCollectionKey] = subCollection;
    } else {
      // This shouldn't happen, but just to be safe
      console.error(
        "CAME ACROSS UNKNOWN COLLECTION TYPE:",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (subCollection as any).oracle_type
      );
    }
  });

  const sortedRollableKeys = oracleIds.sort((r1, r2) =>
    rollables[r1].name.localeCompare(rollables[r2].name)
  );
  const sortedRollableSubCollectionKeys = Object.keys(
    rollableSubCollections
  ).sort((k1, k2) =>
    rollableSubCollections[k1].name.localeCompare(
      rollableSubCollections[k2].name
    )
  );
  const sortedNonRollableSubCollectionKeys = Object.keys(
    nonRollableSubCollections
  ).sort((k1, k2) =>
    nonRollableSubCollections[k1].name.localeCompare(
      nonRollableSubCollections[k2].name
    )
  );

  return (
    <List disablePadding sx={sx}>
      {sortedRollableKeys.map((oracleKey) => (
        <OracleRollableListItem
          key={oracleKey}
          oracleRollable={rollables[oracleKey]}
          actions={actions}
          disabled={disabled}
          rollOnRowClick={rollOnRowClick}
        />
      ))}
      {sortedRollableSubCollectionKeys.map((subCollectionKey) => (
        <OracleRollableCollectionListItem
          key={subCollectionKey}
          collection={rollableSubCollections[subCollectionKey]}
          actions={actions}
          disabled={disabled}
          rollOnRowClick={rollOnRowClick}
        />
      ))}
      {sortedNonRollableSubCollectionKeys.map((subCollectionKey) => (
        <OracleTablesCollectionItem
          key={subCollectionKey}
          collectionKey={subCollectionKey}
          collection={nonRollableSubCollections[subCollectionKey]}
          labelPrefix={collectionPrefixLabel}
          disabled={disabled}
          listItemActions={actions}
          rollOnRowClick={rollOnRowClick}
          collectionActions={collectionActions}
        />
      ))}
    </List>
  );
}
