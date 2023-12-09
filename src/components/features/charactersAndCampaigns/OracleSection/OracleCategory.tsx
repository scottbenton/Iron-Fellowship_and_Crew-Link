import { Box, Collapse, List } from "@mui/material";
import { useRoller } from "stores/appState/useRoller";
import { OracleListItem } from "./OracleListItem";
import { OracleSet } from "dataforged";
import { hiddenOracleCategoryIds } from "data/oracles";
import { useStore } from "stores/store";
import { useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { CATEGORY_VISIBILITY } from "./useFilterOracles";

export interface OracleCategoryProps {
  prefix?: string;
  category: OracleSet;
  forceOpen?: boolean;
  visibleCategories: Record<string, CATEGORY_VISIBILITY>;
  visibleOracles: Record<string, boolean>;
}

export function OracleCategory(props: OracleCategoryProps) {
  const { prefix, category, forceOpen, visibleCategories, visibleOracles } =
    props;

  const { rollOracleTable } = useRoller();
  const openDialog = useStore((store) => store.appState.openDialog);

  const title = prefix
    ? `${prefix} ꞏ ${category.Title.Standard}`
    : category.Title.Standard;

  const sampleNames = category["Sample Names" as "Sample names"];

  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedOrForced = isExpanded || forceOpen || false;

  if (
    hiddenOracleCategoryIds[category.$id] ||
    visibleCategories[category.$id] === CATEGORY_VISIBILITY.HIDDEN
  ) {
    return null;
  }

  return (
    <>
      <List disablePadding>
        {Object.keys(category.Tables ?? {}).length > 0 && (
          <CollapsibleSectionHeader
            open={isExpanded}
            forcedOpen={forceOpen}
            toggleOpen={() => !forceOpen && setIsExpanded((prev) => !prev)}
            text={title}
          />
        )}
        <Collapse in={isExpandedOrForced}>
          <Box
            sx={{
              mb: isExpandedOrForced ? 0.5 : 0,
            }}
          >
            {Array.isArray(sampleNames) &&
              sampleNames.length > 0 &&
              Object.keys(category.Tables ?? {}).length > 0 && (
                <OracleListItem
                  disabled={!isExpandedOrForced}
                  id={category.$id + "/sample_names"}
                  text={"Sample Names"}
                  onRollClick={() =>
                    rollOracleTable(category.$id + "/sample_names", true, true)
                  }
                  onOpenClick={() => openDialog(category.$id + "/sample_names")}
                />
              )}
            {Object.keys(category.Tables ?? {}).map((oracleId, index) => {
              const oracle = category.Tables?.[oracleId];
              if (!oracle) return null;
              return (
                <OracleListItem
                  disabled={!isExpandedOrForced}
                  id={oracle.$id}
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
                />
              );
            })}
          </Box>
        </Collapse>
        {Object.keys(category.Sets ?? {}).map((oracleSetId) => {
          const set = category.Sets?.[oracleSetId];
          if (!set) return null;

          return (
            <Box key={oracleSetId}>
              <OracleCategory
                key={oracleSetId}
                prefix={title}
                category={set}
                forceOpen={forceOpen}
                visibleCategories={visibleCategories}
                visibleOracles={visibleOracles}
              />
            </Box>
          );
        })}
      </List>
    </>
  );
}
