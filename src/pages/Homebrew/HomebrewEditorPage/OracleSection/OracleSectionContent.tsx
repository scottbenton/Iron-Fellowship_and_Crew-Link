import { OracleTablesCollection } from "@datasworn/core";
import { Button } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { useState } from "react";
import { OracleTablesCollectionDialog } from "./OracleTablesCollectionDialog";
import { useStore } from "stores/store";

export interface OracleSectionContentProps {
  homebrewId: string;
  oracles: Record<string, OracleTablesCollection>;
}

export function OracleSectionContent(props: OracleSectionContentProps) {
  const { homebrewId, oracles } = props;

  const [
    oracleTablesCollectionDialogOpen,
    setOracleTablesCollectionDialogOpen,
  ] = useState(false);

  const updateOracles = useStore(
    (store) => store.homebrew.updateExpansionOracles
  );

  const handleOracleTableCollectionUpdate = (
    oracleTableId: string,
    table: OracleTablesCollection
  ) => {
    return updateOracles(homebrewId, {
      [oracleTableId]: table,
    }).catch(() => {});
  };

  return (
    <>
      {Object.keys(oracles).length === 0 ? (
        <EmptyState
          showImage
          title={"No Oracles Found"}
          message={"Create your first Homebrew Oracle Collection"}
          callToAction={
            <Button
              variant={"contained"}
              onClick={() => setOracleTablesCollectionDialogOpen(true)}
            >
              Create a Collection
            </Button>
          }
        />
      ) : (
        <>Todo</>
      )}
      <OracleTablesCollectionDialog
        open={oracleTablesCollectionDialogOpen}
        onClose={() => setOracleTablesCollectionDialogOpen(false)}
        saveCollection={handleOracleTableCollectionUpdate}
        collections={oracles}
      />
    </>
  );
}
