import { OracleCollection, OracleTablesCollection } from "@datasworn/core";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { OracleInfoSection } from "./Sections/OracleInfoSection";
import { OracleTablesSection } from "./Sections/OracleTablesSection";
import { OracleCollectionsSection } from "./Sections/OracleCollectionsSection";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";
import { useStore } from "stores/store";
import { OracleTablesCollectionDialog } from "./OracleTablesCollectionDialog";

export interface OracleSectionContentProps {
  homebrewId: string;
  oracles: Record<string, OracleTablesCollection>;
}

export function OracleSectionContent(props: OracleSectionContentProps) {
  const { homebrewId, oracles } = props;

  const oracleCollectionMap = useOracleCollectionMap([homebrewId]);

  const [openOracleState, setOpenOracleState] = useState<{
    openOracleId?: { dataswornId: string; dbId: string };
    ancestorIds: { dataswornId: string; dbId: string }[];
    dbPath?: string;
  }>({ ancestorIds: [] });
  const openOracleCollection = openOracleState.openOracleId
    ? oracleCollectionMap[openOracleState.openOracleId.dataswornId]
        .oracle_type === "tables"
      ? (oracleCollectionMap[
          openOracleState.openOracleId.dataswornId
        ] as OracleTablesCollection)
      : undefined
    : undefined;

  const [oracleCollectionDialogState, setOracleCollectionDialogState] =
    useState<{
      open: boolean;
      oracleId?: { dataswornId: string; dbId: string };
    }>({ open: false });
  const openCollectionDialog = (ids?: {
    dataswornId: string;
    dbId: string;
  }) => {
    console.debug("SETTING DIALOG STATE WITH IDS", ids);
    setOracleCollectionDialogState({ open: true, oracleId: ids });
  };
  const closeCollectionDialog = () => {
    setOracleCollectionDialogState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const handleOpenOracle = (oracleId: string, dbId: string) => {
    setOpenOracleState((prevState) => {
      const newAncestorIds = [...prevState.ancestorIds];

      if (prevState.openOracleId) {
        newAncestorIds.push(prevState.openOracleId);
      }
      return {
        openOracleId: {
          dataswornId: oracleId,
          dbId,
        },
        ancestorIds: newAncestorIds,
      };
    });
  };

  const handleBreadcrumbClick = (ids?: {
    dataswornId: string;
    dbId: string;
  }) => {
    setOpenOracleState((prevState) => {
      if (!ids) {
        return {
          ancestorIds: [],
        };
      }
      const newAncestorIds = [...prevState.ancestorIds];
      const idx = newAncestorIds.findIndex(
        (id) => id.dataswornId === ids.dataswornId
      );
      if (idx >= 0) {
        newAncestorIds.splice(idx);
        return {
          ancestorIds: newAncestorIds,
          openOracleId: ids,
        };
      }
      return prevState;
    });
  };

  const oracleCollections = openOracleState.openOracleId
    ? openOracleCollection?.oracle_type === "tables"
      ? openOracleCollection.collections ?? {}
      : {}
    : oracles;

  const filteredCollections: Record<string, OracleCollection> = {
    ...oracleCollections,
  };

  const tableCollectionMap = useOracleCollectionMap([homebrewId]);

  const sortedCollectionIds = Object.keys(oracleCollections)
    .filter((k) => oracleCollections[k].oracle_type === "tables")
    .sort((k1, k2) =>
      oracleCollections[k1].name.localeCompare(oracleCollections[k2].name)
    );
  sortedCollectionIds.forEach((k) => {
    filteredCollections[k] = oracleCollections[k] as OracleTablesCollection;
  });

  if (openOracleCollection?.enhances) {
    const enhancesCollection =
      tableCollectionMap[openOracleCollection.enhances];
    if (
      enhancesCollection &&
      enhancesCollection.oracle_type === "tables" &&
      enhancesCollection.collections
    ) {
      Object.keys(enhancesCollection.collections).forEach((key) => {
        const enhancedCollection = (enhancesCollection.collections ?? {})[key];
        if (enhancedCollection) {
          filteredCollections[key] = enhancedCollection;
        }
      });
    }
  }

  const dbPath = openOracleState.ancestorIds
    .map((id) => `${id.dbId}.collections.`)
    .join("");

  const updateOracles = useStore(
    (store) => store.homebrew.updateExpansionOracles
  );

  const handleOracleTableCollectionUpdate = (
    oracleTableId: string,
    table: OracleTablesCollection
  ) => {
    console.debug(dbPath, openOracleState.openOracleId?.dbId);
    console.debug(oracleCollectionDialogState.oracleId);

    const path =
      (dbPath ?? "") +
      // If we have an oracle open (we are not at root)
      (openOracleState.openOracleId?.dbId
        ? // Check if we are editing an existing collection
          oracleCollectionDialogState.oracleId
          ? // If we are, don't set the path further
            ""
          : // If we aren't editing, we are adding - go to the subcollections
            `${openOracleState.openOracleId.dbId}.collections.`
        : // We are at the root, no path necessary
          "") +
      oracleTableId;

    console.debug(path);

    return updateOracles(homebrewId, {
      [path]: table,
    }).catch(() => {});
  };

  return (
    <Stack spacing={2}>
      {openOracleState.openOracleId && (
        <Breadcrumbs aria-label={"Oracle Breadcrumbs"}>
          <Link
            component={"button"}
            underline="hover"
            color="inherit"
            onClick={() => handleBreadcrumbClick(undefined)}
          >
            Collections
          </Link>
          {openOracleState.ancestorIds.map((id) => (
            <Link
              key={id.dataswornId}
              component={"button"}
              underline={"hover"}
              color={"inherit"}
              onClick={() => handleBreadcrumbClick(id)}
            >
              {oracleCollectionMap[id.dataswornId]?.name ?? "Unknown Oracle"}
            </Link>
          ))}
          <Typography color="text.primary">
            {openOracleCollection?.name}
          </Typography>
        </Breadcrumbs>
      )}
      {openOracleState.openOracleId?.dataswornId && openOracleCollection && (
        <OracleInfoSection
          oracle={openOracleCollection}
          openCollectionDialog={() => {
            console.debug(openOracleState);
            openCollectionDialog(
              openOracleState.openOracleId
                ? {
                    dataswornId: openOracleState.openOracleId.dataswornId,
                    dbId: openOracleState.openOracleId.dbId,
                  }
                : undefined
            );
          }}
        />
      )}
      {openOracleState.openOracleId && (
        <OracleTablesSection
          collections={
            openOracleCollection?.oracle_type === "tables"
              ? openOracleCollection.collections ?? {}
              : {}
          }
          rollables={openOracleCollection?.contents ?? {}}
        />
      )}
      <OracleCollectionsSection
        homebrewId={homebrewId}
        collection={
          openOracleCollection?.oracle_type === "tables"
            ? openOracleCollection
            : undefined
        }
        openCollection={handleOpenOracle}
        oracleCollections={
          openOracleState.openOracleId
            ? openOracleCollection?.oracle_type === "tables"
              ? openOracleCollection.collections ?? {}
              : {}
            : oracles
        }
        openCreateCollectionDialog={() => openCollectionDialog()}
      />
      <OracleTablesCollectionDialog
        homebrewId={homebrewId}
        existingCollection={
          oracleCollectionDialogState.oracleId
            ? oracleCollectionMap[
                oracleCollectionDialogState.oracleId.dataswornId
              ]?.oracle_type === "tables"
              ? {
                  collection: oracleCollectionMap[
                    oracleCollectionDialogState.oracleId.dataswornId
                  ] as OracleTablesCollection,
                  key: oracleCollectionDialogState.oracleId.dbId,
                }
              : undefined
            : undefined
        }
        open={oracleCollectionDialogState.open}
        onClose={closeCollectionDialog}
        saveCollection={handleOracleTableCollectionUpdate}
        collections={filteredCollections}
      />
    </Stack>
  );
}
