import { OracleTablesCollection } from "@datasworn/core";
import { Box } from "@mui/material";
import { OracleTablesCollectionItem } from "./OracleTablesCollectionItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { defaultActions } from "./defaultActions";

export interface OracleCollectionListProps {
  oracles: Record<string, OracleTablesCollection>;
  listItemActions?: extraOracleListItemActionsProp;
  rollOnRowClick?: boolean;
}

export function OracleCollectionList(props: OracleCollectionListProps) {
  const { oracles, listItemActions, rollOnRowClick = true } = props;

  const orderedOracleKeys = Object.keys(oracles).sort((o1, o2) => {
    return oracles[o1].name.localeCompare(oracles[o2].name);
  });

  const listItemActionsWithDefault = [
    ...(listItemActions ?? []),
    ...defaultActions,
  ];

  return (
    <Box component={"ul"} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {orderedOracleKeys.map((oracleCollectionKey) => (
        <OracleTablesCollectionItem
          key={oracleCollectionKey}
          collectionKey={oracleCollectionKey}
          collection={oracles[oracleCollectionKey]}
          listItemActions={listItemActionsWithDefault}
          rollOnRowClick={rollOnRowClick}
        />
      ))}
    </Box>
  );
}
