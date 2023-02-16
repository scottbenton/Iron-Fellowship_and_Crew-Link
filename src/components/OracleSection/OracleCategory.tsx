import { List, ListSubheader } from "@mui/material";
import { Oracle, OracleTable } from "types/Oracles.type";
import { useRoller } from "components/DieRollProvider";
import { OracleListItem } from "./OracleListItem";
import { useState } from "react";
import { OracleItemDialog } from "./OracleItemDialog";

export interface OracleCategoryProps {
  category: Oracle;
  pinnedCategories?: { [oracleName: string]: boolean };
}

export function OracleCategory(props: OracleCategoryProps) {
  const { category, pinnedCategories } = props;

  const { rollOracleTable } = useRoller();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openOracleItem, setOpenOracleItem] = useState<{
    categoryName: string;
    name: string;
    table: OracleTable;
  }>();

  return (
    <>
      <List disablePadding>
        <ListSubheader
          sx={(theme) => ({
            backgroundColor: theme.palette.primary.light,
            color: "white",
            ...theme.typography.body1,
            fontFamily: theme.fontFamilyTitle,
          })}
        >
          {category.name}
        </ListSubheader>
        {category.sections.map((section, index) => {
          const { sectionName, table } = section;

          return (
            <OracleListItem
              key={index}
              text={sectionName}
              onRollClick={() =>
                rollOracleTable(category.name, sectionName, table)
              }
              onOpenClick={() => {
                setOpenOracleItem({
                  categoryName: category.name,
                  name: sectionName,
                  table: table,
                });
                setDialogOpen(true);
              }}
              pinned={pinnedCategories && pinnedCategories[sectionName]}
            />
          );
        })}
      </List>
      <OracleItemDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        name={openOracleItem?.name}
        table={openOracleItem?.table}
        handleRoll={() =>
          openOracleItem &&
          rollOracleTable(
            openOracleItem.categoryName,
            openOracleItem.name,
            openOracleItem.table
          )
        }
      />
    </>
  );
}
