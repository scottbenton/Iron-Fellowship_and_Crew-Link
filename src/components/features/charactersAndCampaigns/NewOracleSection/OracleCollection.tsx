import { Datasworn } from "@datasworn/core";
import { CATEGORY_VISIBILITY } from "../OracleSection/useFilterOracles";
import { useMemo, useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { Collapse, List } from "@mui/material";
import { OracleSelectableRollableCollectionListItem } from "./OracleSelectableRollableCollectionListItem";
import { OracleListItem } from "./OracleListItem";

export interface OracleCollectionProps {
  collectionId: string;
  collections: Record<string, Datasworn.OracleCollection>;
  oracles: Record<string, Datasworn.OracleRollable>;
  forceOpen?: boolean;
  visibleCollections: Record<string, CATEGORY_VISIBILITY>;
  visibleOracles: Record<string, boolean>;
  enhancesCollections: Record<string, string[]>;
  disabled?: boolean;
}

export function OracleCollection(props: OracleCollectionProps) {
  const {
    collectionId,
    collections,
    oracles,
    forceOpen,
    visibleCollections,
    visibleOracles,
    enhancesCollections,
    disabled,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedOrForced = isExpanded || forceOpen;

  const collection = collections[collectionId];

  const contents = collection.contents;
  const subCollections =
    collection.oracle_type === "tables" && collection.collections;

  const enhancingCollectionIds = enhancesCollections[collectionId];

  const { oracleIds, subCollectionIds } = useMemo(() => {
    const oracleIds = Object.values(contents ?? {}).map((oracle) => oracle.id);

    const subCollectionIds = Object.values(subCollections || {}).map(
      (subCollection) => subCollection.id
    );

    (enhancingCollectionIds ?? []).forEach((enhancesId) => {
      const enhancingCollection = collections[enhancesId];
      if (enhancingCollection) {
        oracleIds.push(
          ...Object.values(enhancingCollection.contents ?? {}).map(
            (oracle) => oracle.id
          )
        );
        if (enhancingCollection.oracle_type === "tables") {
          subCollectionIds.push(
            ...Object.values(enhancingCollection.collections ?? {}).map(
              (subCollection) => subCollection.id
            )
          );
        }
      }
    });

    oracleIds.sort((o1, o2) => {
      const oracle1 = oracles[o1];
      const oracle2 = oracles[o2];
      if (oracle1 && oracle2) {
        return oracle1.name.localeCompare(oracle2.name);
      }
      return 0;
    });

    subCollectionIds.sort((c1, c2) => {
      const sc1 = collections[c1];
      const sc2 = collections[c2];
      if (sc1 && sc2) {
        if (sc1.oracle_type !== sc2.oracle_type) {
          if (sc1.oracle_type === "tables") {
            return 1;
          } else if (sc2.oracle_type === "tables") {
            return -1;
          }
        }
        return sc1.name.localeCompare(sc2.name);
      }
      return 0;
    });

    return { oracleIds, subCollectionIds };
  }, [contents, subCollections, collections, oracles, enhancingCollectionIds]);

  if (
    visibleCollections[collectionId] === CATEGORY_VISIBILITY.HIDDEN ||
    !collection
  ) {
    return null;
  } else if (
    collection.oracle_type === "table_shared_details" ||
    collection.oracle_type === "table_shared_results"
  ) {
    return (
      <OracleSelectableRollableCollectionListItem
        collection={collection}
        disabled={disabled}
      />
    );
  }

  return (
    <>
      <CollapsibleSectionHeader
        open={isExpanded}
        forcedOpen={forceOpen}
        toggleOpen={() => !forceOpen && setIsExpanded((prev) => !prev)}
        text={collection.name}
        disabled={disabled}
      />
      <Collapse in={isExpandedOrForced}>
        <List sx={{ py: 0, mb: isExpandedOrForced ? 0.5 : 0 }}>
          {oracleIds.map((oracleId) => (
            <OracleListItem
              key={oracleId}
              oracleId={oracleId}
              oracles={oracles}
              disabled={!isExpandedOrForced || disabled}
              visibleOracles={visibleOracles}
              collectionVisibility={visibleCollections[collectionId]}
            />
          ))}
          {subCollectionIds.map((subCollectionId) => (
            <OracleCollection
              key={subCollectionId}
              collectionId={subCollectionId}
              collections={collections}
              oracles={oracles}
              forceOpen={forceOpen}
              visibleCollections={visibleCollections}
              visibleOracles={visibleOracles}
              enhancesCollections={enhancesCollections}
              disabled={disabled || !isExpandedOrForced}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
