import { Datasworn } from "@datasworn/core";
import { OracleTablesCollectionSubList } from "components/features/charactersAndCampaigns/NewOracleSection/OracleTablesCollectionSubList";
import { defaultActions } from "components/features/charactersAndCampaigns/NewOracleSection/defaultActions";

export interface OracleCollectionProps {
  collection: Datasworn.OracleTablesCollection;
}

export function OracleCollection(props: OracleCollectionProps) {
  const { collection } = props;

  return (
    <OracleTablesCollectionSubList
      oracleIds={Object.keys(collection.contents ?? {})}
      subCollectionIds={Object.keys(collection.collections ?? {})}
      actions={defaultActions}
      rollOnRowClick
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
