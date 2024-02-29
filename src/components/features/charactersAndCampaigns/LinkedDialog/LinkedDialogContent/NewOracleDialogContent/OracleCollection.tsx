import { Datasworn } from "@datasworn/core";
import { useStore } from "stores/store";
import { OracleCollection as OracleCollectionRenderer } from "components/features/charactersAndCampaigns/NewOracleSection/OracleCollection";
import { CATEGORY_VISIBILITY } from "components/features/charactersAndCampaigns/NewOracleSection/useFilterOracles";

export interface OracleCollectionProps {
  collection: Datasworn.OracleTablesCollection;
}

export function OracleCollection(props: OracleCollectionProps) {
  const { collection } = props;

  const oracles = useStore((store) => store.rules.oracleMaps.oracleRollableMap);
  const collections = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );

  return (
    <OracleCollectionRenderer
      collectionId={collection.id}
      collections={collections}
      oracles={oracles}
      visibleCollections={{ [collection.id]: CATEGORY_VISIBILITY.ALL }}
      enhancesCollections={{}}
      visibleOracles={{}}
    />
  );
}
