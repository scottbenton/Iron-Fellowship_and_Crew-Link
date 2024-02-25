import {
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { CATEGORY_VISIBILITY } from "./useFilterMoves";
import { Datasworn } from "@datasworn/core";

export interface MoveCategoryProps {
  category: Datasworn.MoveCategory;
  openMove: (move: Datasworn.Move) => void;
  forceOpen?: boolean;
  visibleCategories: Record<string, CATEGORY_VISIBILITY>;
  visibleMoves: Record<string, boolean>;
}

export function MoveCategory(props: MoveCategoryProps) {
  const { category, openMove, forceOpen, visibleCategories, visibleMoves } =
    props;

  const [isExpanded, setIsExpanded] = useState(false);

  const isExpandedOrForced = isExpanded || forceOpen;

  if (visibleCategories[category.id] === CATEGORY_VISIBILITY.HIDDEN) {
    return null;
  }

  return (
    <>
      <CollapsibleSectionHeader
        open={isExpanded}
        forcedOpen={forceOpen}
        toggleOpen={() => !forceOpen && setIsExpanded((prev) => !prev)}
        text={category.name}
      />

      <Collapse in={isExpandedOrForced}>
        <Box
          sx={{
            mb: isExpandedOrForced ? 0.5 : 0,
          }}
        >
          {Object.values(category.contents ?? {}).map((move, index) =>
            visibleCategories[category.id] === CATEGORY_VISIBILITY.ALL ||
            visibleMoves[move.id] === true ? (
              <ListItem
                id={move.id}
                key={index}
                sx={(theme) => ({
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.background.paperInlay,
                  },
                })}
                disablePadding
              >
                <ListItemButton
                  disabled={!isExpandedOrForced}
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
                    {move.name}
                  </Box>
                  <ListItemIcon sx={{ minWidth: "unset" }}>
                    <OpenIcon />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ) : null
          )}
        </Box>
      </Collapse>
    </>
  );
}
