import { Box, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { CATEGORY_VISIBILITY } from "./useFilterMoves";
import { Datasworn } from "@datasworn/core";
import { Move } from "./Move";

export interface MoveCategoryProps {
  category: Datasworn.MoveCategory;
  categories: Record<string, Datasworn.MoveCategory>;
  moveMap: Record<string, Datasworn.Move>;
  openMove: (move: Datasworn.Move) => void;
  forceOpen?: boolean;
  visibleCategories: Record<string, CATEGORY_VISIBILITY>;
  visibleMoves: Record<string, boolean>;
  shouldExpandLocally?: boolean;
  enhancesCollections: Record<string, string[]>;
}

export function MoveCategory(props: MoveCategoryProps) {
  const {
    category,
    categories,
    moveMap,
    openMove,
    forceOpen,
    visibleCategories,
    visibleMoves,
    enhancesCollections,
    shouldExpandLocally,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const isExpandedOrForced = isExpanded || forceOpen;

  const enhancingCollectionIds = enhancesCollections[category._id];

  const contents = category.contents;

  const moveIds = useMemo(() => {
    const moveIds = Object.values(contents ?? {}).map((move) => move._id);

    (enhancingCollectionIds ?? []).forEach((enhancesId) => {
      const enhancingCollection = categories[enhancesId];
      if (enhancingCollection) {
        moveIds.push(
          ...Object.values(enhancingCollection.contents ?? {}).map(
            (move) => move._id,
          ),
        );
      }
    });

    return moveIds;
  }, [contents, categories, enhancingCollectionIds]);

  if (visibleCategories[category._id] === CATEGORY_VISIBILITY.HIDDEN) {
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
          {moveIds.map((moveId, index) =>
            visibleCategories[category._id] === CATEGORY_VISIBILITY.ALL ||
            visibleMoves[moveId] === true ? (
              <Move
                key={index}
                move={moveMap[moveId]}
                disabled={!isExpandedOrForced}
                openMove={openMove}
                shouldExpandLocally={shouldExpandLocally}
              />
            ) : null,
          )}
        </Box>
      </Collapse>
    </>
  );
}
