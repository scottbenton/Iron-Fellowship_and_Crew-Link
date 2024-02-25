import { Button } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { OracleTablesCollectionCard } from "./OracleTablesCollectionCard";
import { EmptyState } from "components/shared/EmptyState";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";

export interface OracleCollectionsSectionProps {
  openCollectionId?: string;
  oracleCollections: Record<string, StoredOracleCollection>;
  openCollection: (collectionId: string) => void;
  openCreateCollectionDialog: () => void;
}

export function OracleCollectionsSection(props: OracleCollectionsSectionProps) {
  const {
    openCollectionId,
    oracleCollections,
    openCollection,
    openCreateCollectionDialog,
  } = props;

  const filteredCollectionIds = Object.keys(oracleCollections).filter(
    (collectionKey) =>
      oracleCollections[collectionKey].parentOracleCollectionId ===
      openCollectionId
  );

  const sortedCollectionIds = filteredCollectionIds.sort((k1, k2) =>
    oracleCollections[k1].label.localeCompare(oracleCollections[k2].label)
  );

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
          oracle={oracleCollections[id]}
          onClick={() => (oracleCollections[id] ? openCollection(id) : {})}
        />
      ))}
    </>
  );
}
