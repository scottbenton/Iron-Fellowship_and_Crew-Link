import { Button, List } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { StoredOracleTable } from "types/homebrew/HomebrewOracles.type";
import { OracleTableDialog } from "./OracleTableDialog";
import { OracleTableCard } from "./OracleTableCard";

export interface OracleTablesSectionProps {
  homebrewId: string;
  tables: Record<string, StoredOracleTable>;
  parentCollectionKey: string;
}

export function OracleTablesSection(props: OracleTablesSectionProps) {
  const { homebrewId, tables, parentCollectionKey } = props;

  const [oracleTableDialogState, setOracleTableDialogState] = useState<{
    open: boolean;
    editingOracleTableId?: string;
  }>({ open: false });

  const sortedKeys = Object.keys(tables)
    .filter((k) => tables[k].oracleCollectionId === parentCollectionKey)
    .sort((k1, k2) => tables[k1].label.localeCompare(tables[k2].label));

  return (
    <>
      <SectionHeading
        label='Tables'
        action={
          <Button
            color={"inherit"}
            onClick={() => setOracleTableDialogState({ open: true })}
          >
            Create Table
          </Button>
        }
        floating
      />

      {sortedKeys.length > 0 ? (
        <List>
          {sortedKeys.map((key) => (
            <OracleTableCard
              key={key}
              oracle={tables[key]}
              onClick={() =>
                setOracleTableDialogState({
                  open: true,
                  editingOracleTableId: key,
                })
              }
            />
          ))}
        </List>
      ) : (
        <EmptyState
          message='Add an oracle table to get started'
          callToAction={
            <Button
              color={"inherit"}
              variant={"outlined"}
              onClick={() => setOracleTableDialogState({ open: true })}
            >
              Create Table
            </Button>
          }
        />
      )}
      <OracleTableDialog
        homebrewId={homebrewId}
        parentCollectionId={parentCollectionKey}
        open={oracleTableDialogState.open}
        onClose={() => setOracleTableDialogState({ open: false })}
        tables={tables}
        editingOracleTableId={oracleTableDialogState.editingOracleTableId}
      />
    </>
  );
}
