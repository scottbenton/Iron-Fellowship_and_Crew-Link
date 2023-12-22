import {
  OracleCollection,
  OracleTableRollable,
  OracleTableSharedRolls,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTablesCollection,
} from "@datasworn/core";
import { List, SxProps } from "@mui/material";
import { OracleRollableListItem } from "./OracleRollableListItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { OracleRollableCollectionListItem } from "./OracleRollableCollectionListItem";
import { OracleTablesCollectionItem } from "./OracleTablesCollectionItem";

export interface OracleTablesCollectionSubListProps {
  oracles: Record<string, OracleTableRollable>;
  subCollections: Record<string, OracleCollection>;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;
  collectionPrefixLabel?: string;
  sx?: SxProps;
}

export function OracleTablesCollectionSubList(
  props: OracleTablesCollectionSubListProps
) {
  const {
    oracles,
    subCollections,
    actions,
    disabled,
    collectionPrefixLabel,
    sx,
  } = props;

  const rollableSubCollections: Record<
    string,
    OracleTableSharedRolls | OracleTableSharedDetails | OracleTableSharedResults
  > = {};
  const nonRollableSubCollections: Record<string, OracleTablesCollection> = {};

  const unsortedSubCollections = subCollections ?? {};
  Object.keys(unsortedSubCollections).forEach((subCollectionKey) => {
    if (unsortedSubCollections[subCollectionKey].oracle_type === "tables") {
      nonRollableSubCollections[subCollectionKey] = unsortedSubCollections[
        subCollectionKey
      ] as OracleTablesCollection;
    } else if (
      unsortedSubCollections[subCollectionKey].oracle_type ===
      "table_shared_rolls"
    ) {
      rollableSubCollections[subCollectionKey] = unsortedSubCollections[
        subCollectionKey
      ] as OracleTableSharedRolls;
    } else if (
      unsortedSubCollections[subCollectionKey].oracle_type ===
      "table_shared_details"
    ) {
      rollableSubCollections[subCollectionKey] = unsortedSubCollections[
        subCollectionKey
      ] as OracleTableSharedDetails;
    } else if (
      unsortedSubCollections[subCollectionKey].oracle_type ===
      "table_shared_results"
    ) {
      rollableSubCollections[subCollectionKey] = unsortedSubCollections[
        subCollectionKey
      ] as OracleTableSharedResults;
    } else {
      console.error(
        "CAME ACROSS UNKNOWN COLLECTION TYPE:",
        unsortedSubCollections[subCollectionKey].oracle_type
      );
    }
  });

  const sortedRollableKeys = Object.keys(oracles).sort((r1, r2) =>
    oracles[r1].name.localeCompare(oracles[r2].name)
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
          oracleRollable={oracles[oracleKey]}
          actions={actions}
          disabled={disabled}
        />
      ))}
      {sortedRollableSubCollectionKeys.map((subCollectionKey) => (
        <OracleRollableCollectionListItem
          key={subCollectionKey}
          collection={rollableSubCollections[subCollectionKey]}
          actions={actions}
          disabled={disabled}
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
        />
      ))}
    </List>
  );
}
