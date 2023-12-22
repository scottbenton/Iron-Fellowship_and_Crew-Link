import { OracleTablesCollection } from "@datasworn/core";
import { OracleTablesCollectionSubList } from "components/sharedIronsworn/NewOracles/OracleTablesCollectionSubList";
import { defaultActions } from "components/sharedIronsworn/NewOracles/defaultActions";

export interface OracleCollectionProps {
  collection: OracleTablesCollection;
}

export function OracleCollection(props: OracleCollectionProps) {
  const { collection } = props;

  return (
    <OracleTablesCollectionSubList
      oracles={collection.contents ?? {}}
      subCollections={collection.collections ?? {}}
      actions={defaultActions}
      sx={{
        borderColor: "divider",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 1,
        overflow: "hidden",
      }}
    />
  );
}
