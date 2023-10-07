import { Box, List, ListSubheader } from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { OracleListItem } from "./OracleListItem";
import { OracleSet } from "dataforged";
import { useLinkedDialog } from "providers/LinkedDialogProvider";
import { hiddenOracleIds } from "data/oracles";

export interface OracleCategoryProps {
  prefix?: string;
  category: OracleSet;
  pinnedCategories?: { [oracleName: string]: boolean };
}

export function OracleCategory(props: OracleCategoryProps) {
  const { prefix, category, pinnedCategories } = props;

  const { rollOracleTable } = useRoller();
  const { openDialog } = useLinkedDialog();

  const title = prefix
    ? `${prefix} ꞏ ${category.Title.Standard}`
    : category.Title.Standard;

  return (
    <>
      <List disablePadding>
        {Object.keys(category.Tables ?? {}).length > 0 && (
          <ListSubheader
            sx={(theme) => ({
              backgroundColor:
                theme.palette.darkGrey[
                  theme.palette.mode === "light" ? "light" : "dark"
                ],
              color: theme.palette.darkGrey.contrastText,
              ...theme.typography.body1,
              fontFamily: theme.fontFamilyTitle,
            })}
          >
            {title}
          </ListSubheader>
        )}
        {Object.keys(category.Tables ?? {}).map((oracleId, index) => {
          const oracle = category.Tables?.[oracleId];
          if (hiddenOracleIds[oracleId] || !oracle) return null;
          return (
            <OracleListItem
              id={oracleId}
              key={index}
              text={
                oracleId === "ironsworn/oracles/moves/reveal_a_danger_alt"
                  ? "Reveal a Danger (Alt)"
                  : oracle.Title.Short
              }
              onRollClick={() => rollOracleTable(oracle.$id, true, true)}
              onOpenClick={() => {
                openDialog(oracle.$id);
              }}
              pinned={pinnedCategories && pinnedCategories[oracle.$id]}
            />
          );
        })}
        {Object.keys(category.Sets ?? {}).map((oracleSetId, index) => {
          const set = category.Sets?.[oracleSetId];
          if (!set) return null;

          return (
            <Box key={oracleSetId}>
              <OracleCategory
                key={oracleSetId}
                prefix={title}
                category={set}
                pinnedCategories={pinnedCategories}
              />
            </Box>
          );
        })}
      </List>
    </>
  );
}
