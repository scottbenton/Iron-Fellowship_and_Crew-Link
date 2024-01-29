import {
  OracleCollection,
  OracleRollable,
  OracleTableRollable,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
} from "@datasworn/core";
import { Button, Dialog, List, ListItem } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { OracleTableDialogContents } from "./OracleTablesSection/OracleTableDialogContents";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export interface OracleTablesSectionProps {
  homebrewId: string;
  collections: Record<string, OracleCollection>;
  rollables: Record<string, OracleRollable>;
  dbPath: string;
  parentCollectionKey?: string;
}

export function OracleTablesSection(props: OracleTablesSectionProps) {
  const { homebrewId, collections, rollables, dbPath, parentCollectionKey } =
    props;

  const [oracleTableDialogState, setOracleTableDialogState] = useState<{
    open: boolean;
  }>({ open: false });
  const openOracleTableDialog = () => {
    setOracleTableDialogState({ open: true });
  };
  const closeOracleTableDialog = () => {
    setOracleTableDialogState((prev) => ({ ...prev, open: false }));
  };

  const actualRollables: Record<
    string,
    | OracleRollable
    | OracleTableSharedDetails
    | OracleTableSharedResults
    | OracleTableSharedRolls
  > = { ...rollables };

  Object.values(collections).forEach((collection) => {
    if (collection.oracle_type !== "tables") {
      actualRollables[collection.id] = collection;
    }
  });

  const sortedKeys = Object.keys(actualRollables).sort((k1, k2) =>
    actualRollables[k1].name.localeCompare(actualRollables[k2].name)
  );

  const oracleTableRollables: Record<string, OracleTableRollable> = {};

  Object.keys(rollables).forEach((rollableKey) => {
    const rollable = rollables[rollableKey];
    if (
      rollable.oracle_type === "table_simple" ||
      rollable.oracle_type === "table_details"
    ) {
      oracleTableRollables[rollableKey] = rollable;
    }
  });

  return (
    <>
      <SectionHeading
        label="Tables"
        action={
          <Button color={"inherit"} onClick={() => openOracleTableDialog()}>
            Create Table
          </Button>
        }
        floating
      />

      {sortedKeys.length > 0 ? (
        <List>
          {sortedKeys.map((key) => (
            <ListItem key={key}>{actualRollables[key].name}</ListItem>
          ))}
        </List>
      ) : (
        <EmptyState
          message="Add an oracle table to get started"
          callToAction={
            <Button
              color={"inherit"}
              variant={"outlined"}
              onClick={() => openOracleTableDialog()}
            >
              Create Table
            </Button>
          }
        />
      )}
      <Dialog
        open={oracleTableDialogState.open}
        onClose={closeOracleTableDialog}
      >
        <DialogTitleWithCloseButton onClose={closeOracleTableDialog}>
          Create Oracle Table
        </DialogTitleWithCloseButton>
        <OracleTableDialogContents
          homebrewId={homebrewId}
          onClose={closeOracleTableDialog}
          tables={oracleTableRollables}
          dbPath={dbPath}
          parentCollectionKey={parentCollectionKey}
        />
      </Dialog>
    </>
  );
}
