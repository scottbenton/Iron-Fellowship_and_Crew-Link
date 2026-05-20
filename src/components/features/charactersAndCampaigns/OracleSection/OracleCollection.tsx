import { Datasworn } from "@datasworn/core";
import { useMemo, useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { Collapse, List } from "@mui/material";
import { OracleSelectableRollableCollectionListItem } from "./OracleSelectableRollableCollectionListItem";
import { OracleListItem } from "./OracleListItem";
import {
  CATEGORY_VISIBILITY,
  CombinedCollectionType,
} from "./useFilterOracles";
import { useStore } from "stores/store";
import { ToggleVisibilityButton } from "../../../shared/ToggleVisibilityButton";

export interface OracleCollectionProps {
  collectionId: string;
  collections: Record<string, CombinedCollectionType>;
  oracles: Record<string, Datasworn.OracleRollable>;
  forceOpen?: boolean;
  visibleCollections: Record<string, CATEGORY_VISIBILITY>;
  visibleOracles: Record<string, boolean>;
  enhancesCollections: Record<string, string[]>;
  disabled?: boolean;
  actionIsHide?: boolean;
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
    actionIsHide,
  } = props;

  const hiddenOracles = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.hiddenOracleIds
  );
  const updateHiddenOracles = useStore(
    (store) => store.campaigns.currentCampaign.updateHiddenOracles
  );

  const [hideIsloading, setHideIsLoading] = useState(false);

  const onToggleVisibility = () => {
    setHideIsLoading(true);
    updateHiddenOracles(collectionId, !hidden)
      .catch(() => {
      })
      .finally(() => {
        setHideIsLoading(false);
      });
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedOrForced = isExpanded || forceOpen;

  const collection = collections[collectionId];

  const contents = collection.contents;
  const subCollections =
    collection.oracle_type === "tables" && collection.collections;

  const enhancingCollectionIds = enhancesCollections[collectionId];

  const { oracleIds, subCollectionIds } = useMemo(() => {
    const oracleIds = Object.values(contents ?? {}).map((oracle) => oracle._id);

    const subCollectionIds = Object.values(subCollections || {}).map(
      (subCollection) => subCollection._id
    );

    (enhancingCollectionIds ?? []).forEach((enhancesId) => {
      const enhancingCollection = collections[enhancesId];
      if (enhancingCollection) {
        oracleIds.push(
          ...Object.values(enhancingCollection.contents ?? {}).map(
            (oracle) => oracle._id
          )
        );
        if (enhancingCollection.oracle_type === "tables") {
          subCollectionIds.push(
            ...Object.values(enhancingCollection.collections ?? {}).map(
              (subCollection) => subCollection._id
            )
          );
        }
      }
    });

    return { oracleIds, subCollectionIds };
  }, [contents, subCollections, collections, enhancingCollectionIds]);

  const hidden = hiddenOracles?.includes(collectionId);

  if (
    visibleCollections[collectionId] === CATEGORY_VISIBILITY.HIDDEN ||
    !collection ||
    (!actionIsHide && hidden)
  ) {
    return null;
  } else if (
    collection.oracle_type === "table_shared_text" ||
    collection.oracle_type === "table_shared_text2" ||
    collection.oracle_type === "table_shared_text3"
  ) {
    return (
      <OracleSelectableRollableCollectionListItem
        collection={collection}
        disabled={disabled}
        actionIsHide={actionIsHide}
        hidden={hidden}
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
        actions={actionIsHide ? (
          <ToggleVisibilityButton
              onToggleVisibility={onToggleVisibility}
              loading={hideIsloading}
              hidden={hidden}
            />
        ) : undefined}
        hidden={hidden}
      />
      <Collapse in={isExpandedOrForced}>
        <List sx={{ py: 0, mb: isExpandedOrForced ? 0.5 : 0 }}>
          {oracleIds.map((oracleId) => {
            const hidden = hiddenOracles?.includes(oracleId);
            return (
              <OracleListItem
                key={collectionId + "-" + oracleId}
                oracleId={oracleId}
                oracles={oracles}
                disabled={!isExpandedOrForced || disabled}
                visibleOracles={visibleOracles}
                collectionVisibility={visibleCollections[collection._id]}
                actionIsHide={actionIsHide}
                hidden={hidden}
              />
            );
          })}
          {subCollectionIds.map((subCollectionId) => (
            <OracleCollection
              key={collectionId + "-" + subCollectionId}
              collectionId={subCollectionId}
              collections={collections}
              oracles={oracles}
              forceOpen={forceOpen}
              visibleCollections={visibleCollections}
              visibleOracles={visibleOracles}
              enhancesCollections={enhancesCollections}
              disabled={disabled || !isExpandedOrForced}
              actionIsHide={actionIsHide}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
