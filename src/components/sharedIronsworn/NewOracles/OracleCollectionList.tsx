import { Box } from "@mui/material";
import { OracleTablesCollectionItem } from "./OracleTablesCollectionItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { defaultActions } from "./defaultActions";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";
import { extraOracleCollectionActionsProp } from "./oracleCollectionActions";

export interface OracleCollectionListProps {
  homebrewIds?: string[];
  collectionIds: string[];
  listItemActions?: extraOracleListItemActionsProp;
  collectionActions?: extraOracleCollectionActionsProp;
  rollOnRowClick?: boolean;
}

export function OracleCollectionList(props: OracleCollectionListProps) {
  const {
    collectionIds,
    homebrewIds,
    listItemActions,
    collectionActions,
    rollOnRowClick = true,
  } = props;

  const oracleCategories = useOracleCollectionMap(homebrewIds);

  const orderedOracleKeys = collectionIds.sort((o1, o2) => {
    return oracleCategories[o1]?.name.localeCompare(oracleCategories[o2]?.name);
  });

  const listItemActionsWithDefault = [
    ...(listItemActions ?? []),
    ...defaultActions,
  ];

  return (
    <Box component={"ul"} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {orderedOracleKeys.map((oracleCollectionKey) => {
        const category = oracleCategories[oracleCollectionKey];
        if (category?.oracle_type !== "tables") {
          return null;
        }
        return (
          <OracleTablesCollectionItem
            homebrewIds={homebrewIds}
            key={oracleCollectionKey}
            collectionKey={oracleCollectionKey}
            collection={category}
            listItemActions={listItemActionsWithDefault}
            collectionActions={collectionActions}
            rollOnRowClick={rollOnRowClick}
          />
        );
      })}
    </Box>
  );
}
