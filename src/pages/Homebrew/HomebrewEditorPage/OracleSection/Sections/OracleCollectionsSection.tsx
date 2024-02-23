import { Datasworn } from "@datasworn/core";
import { Button } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { OracleTablesCollectionCard } from "../Cards";
import { EmptyState } from "components/shared/EmptyState";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";

export interface OracleCollectionsSectionProps {
  homebrewId: string;
  collection?: Datasworn.OracleTablesCollection;
  oracleCollections: Record<string, Datasworn.OracleCollection>;
  openCollection: (collectionId: string, dbId: string) => void;
  openCreateCollectionDialog: () => void;
}

export function OracleCollectionsSection(props: OracleCollectionsSectionProps) {
  const {
    homebrewId,
    collection,
    oracleCollections,
    openCollection,
    openCreateCollectionDialog,
  } = props;

  const filteredCollections: Record<string, Datasworn.OracleCollection> = {
    ...oracleCollections,
  };

  const tableCollectionMap = useOracleCollectionMap([homebrewId]);

  const sortedCollectionIds = Object.keys(oracleCollections)
    .filter((k) => oracleCollections[k].oracle_type === "tables")
    .sort((k1, k2) =>
      oracleCollections[k1].name.localeCompare(oracleCollections[k2].name)
    );
  sortedCollectionIds.forEach((k) => {
    filteredCollections[k] = oracleCollections[
      k
    ] as Datasworn.OracleTablesCollection;
  });

  if (collection?.enhances) {
    const enhancesCollection = tableCollectionMap[collection.enhances];
    if (
      enhancesCollection &&
      enhancesCollection.oracle_type === "tables" &&
      enhancesCollection.collections
    ) {
      Object.keys(enhancesCollection.collections).forEach((key) => {
        const enhancedCollection = (enhancesCollection.collections ?? {})[key];
        if (enhancedCollection) {
          filteredCollections[key] = enhancedCollection;
        }
      });
    }
  }

  return (
    <>
      <SectionHeading
        label={"Collections"}
        action={
          <Button color={"inherit"} onClick={openCreateCollectionDialog}>
            Create Collection
          </Button>
        }
        floating
      />
      {sortedCollectionIds.length === 0 && (
        <EmptyState
          message='Add an oracle collection to group your tables together'
          callToAction={
            <Button
              variant='outlined'
              color={"inherit"}
              onClick={openCreateCollectionDialog}
            >
              Create Collection
            </Button>
          }
        />
      )}
      {sortedCollectionIds.map((id) => (
        <OracleTablesCollectionCard
          key={id}
          oracle={oracleCollections[id] as Datasworn.OracleTablesCollection}
          onClick={() =>
            oracleCollections[id]
              ? openCollection(oracleCollections[id].id, id)
              : {}
          }
        />
      ))}
    </>
  );
}
