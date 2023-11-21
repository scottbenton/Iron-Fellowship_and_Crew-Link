import {
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import { Move, MoveCategory as IMoveCategory } from "dataforged";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useNewMoveOracleView } from "hooks/featureFlags/useNewMoveOracleView";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";

export interface MoveCategoryProps {
  category: IMoveCategory;
  openMove: (move: Move) => void;
  forceOpen?: boolean;
}

export function MoveCategory(props: MoveCategoryProps) {
  const { category, openMove, forceOpen } = props;

  const showNewView = useNewMoveOracleView();
  const [isExpanded, setIsExpanded] = useState(showNewView ? false : true);

  const isExpandedOrForced = isExpanded || forceOpen;

  return (
    <>
      {showNewView ? (
        <CollapsibleSectionHeader
          open={isExpandedOrForced ?? false}
          toggleOpen={() => !forceOpen && setIsExpanded((prev) => !prev)}
          text={category.Title.Standard}
        />
      ) : (
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
      )}
      <Collapse in={isExpandedOrForced}>
        <Box
          sx={{
            mb: showNewView && isExpandedOrForced ? 0.5 : 0,
          }}
        >
          {Object.values(category.Moves).map((move, index) => (
            <ListItem
              id={move.$id}
              key={index}
              sx={(theme) => ({
                "&:nth-of-type(even)": {
                  backgroundColor: theme.palette.background.paperInlay,
                },
              })}
              disablePadding
            >
              <ListItemButton
                onClick={() => openMove(move)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={(theme) => ({
                    ...theme.typography.body2,
                    color: theme.palette.text.primary,
                  })}
                >
                  {move.Title.Standard}
                </Box>
                <ListItemIcon sx={{ minWidth: "unset" }}>
                  <OpenIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      </Collapse>
    </>
  );
}
