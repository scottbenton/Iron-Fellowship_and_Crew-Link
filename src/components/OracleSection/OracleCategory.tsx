import {
  List,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  ListItem,
} from "@mui/material";
import { Oracle } from "types/Oracles.type";
import { D10Icon } from "assets/D10Icon";
import { useRoller } from "components/DieRollProvider";

export interface OracleCategoryProps {
  category: Oracle;
}

export function OracleCategory(props: OracleCategoryProps) {
  const { category } = props;

  const { rollOracleTable } = useRoller();

  return (
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
        const { sectionName, table, subSection } = section;

        if (table) {
          return (
            <ListItemButton
              key={index}
              sx={(theme) => ({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:nth-of-type(odd)": {
                  backgroundColor: theme.palette.action.hover,
                },
              })}
              onClick={() => rollOracleTable(category.name, sectionName, table)}
            >
              <ListItemIcon>
                <D10Icon />
              </ListItemIcon>
              <ListItemText primary={sectionName} />
            </ListItemButton>
          );
        } else if (subSection) {
          return subSection.map((subSection, index) => (
            <ListItemButton
              key={index}
              onClick={() =>
                rollOracleTable(
                  category.name,
                  subSection.subSectionName,
                  subSection.table
                )
              }
            >
              <ListItemIcon>
                <D10Icon />
              </ListItemIcon>
              <ListItemText
                primary={sectionName + ": " + subSection.subSectionName}
              />
            </ListItemButton>
          ));
        } else {
          return null;
        }
      })}
    </List>
  );
}
