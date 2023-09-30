import { List, ListSubheader } from "@mui/material";
import { useRoller } from "providers/DieRollProvider";
import { OracleListItem } from "./OracleListItem";
import { OracleSet } from "dataforged";
import { useLinkedDialog } from "providers/LinkedDialogProvider";
import { hiddenOracleIds } from "data/oracles";

export interface OracleCategoryProps {
  category: OracleSet;
  pinnedCategories?: { [oracleName: string]: boolean };
}

export function OracleCategory(props: OracleCategoryProps) {
  const { category, pinnedCategories } = props;

  const { rollOracleTable } = useRoller();
  const { openDialog } = useLinkedDialog();

  return (
    <>
      <List disablePadding>
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
          {category.Title.Standard}
        </ListSubheader>
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
      </List>
    </>
  );
}
