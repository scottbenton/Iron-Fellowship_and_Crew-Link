import {
  OracleCollection,
  OracleRollable,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
} from "@datasworn/core";
import { List, ListItem } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";

export interface OracleTablesSectionProps {
  collections: Record<string, OracleCollection>;
  rollables: Record<string, OracleRollable>;
}

export function OracleTablesSection(props: OracleTablesSectionProps) {
  const { collections, rollables } = props;

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

  return (
    <>
      <SectionHeading
        label="Tables"
        sx={{ borderRadius: 1, pl: 2, pr: 0.5, mt: 4 }}
      />

      {sortedKeys.length > 0 ? (
        <List>
          {sortedKeys.map((key) => (
            <ListItem key={key}>{actualRollables[key].name}</ListItem>
          ))}
        </List>
      ) : (
        <EmptyState message="Add an oracle table to get started" />
      )}
    </>
  );
}
