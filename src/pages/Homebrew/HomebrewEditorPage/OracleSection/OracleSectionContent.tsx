import { Datasworn } from "@datasworn/core";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { OracleInfoSection } from "./Sections/OracleInfoSection";
import { OracleTablesSection } from "./Sections/OracleTablesSection";
import { OracleCollectionsSection } from "./Sections/OracleCollectionsSection";
import { useOracleCollectionMap } from "data/hooks/useOracleCollectionMap";
import { OracleTablesCollectionDialog } from "./OracleTablesCollectionDialog";

export interface OracleSectionContentProps {
  homebrewId: string;
  oracles: Record<string, Datasworn.OracleTablesCollection>;
}

export function OracleSectionContent(props: OracleSectionContentProps) {
  const { homebrewId, oracles } = props;

  const oracleCollectionMap = useOracleCollectionMap([homebrewId]);

  // Open oracle collection
  const [openOracleState, setOpenOracleState] = useState<{
    openOracleId?: { dataswornId: string; dbId: string };
    ancestorIds: { dataswornId: string; dbId: string }[];
    dbPath?: string;
  }>({ ancestorIds: [] });
  const openOracleCollection = openOracleState.openOracleId
    ? oracleCollectionMap[openOracleState.openOracleId.dataswornId]
        ?.oracle_type === "tables"
      ? (oracleCollectionMap[
          openOracleState.openOracleId.dataswornId
        ] as Datasworn.OracleTablesCollection)
      : undefined
    : undefined;
  // Handle Oracle Collection Navigation
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
  const goUpOneCollectionLevel = () => {
    setOpenOracleState((prevState) => {
      const newAncestorIds = [...prevState.ancestorIds];
      const previousAncestor = newAncestorIds.pop();

      if (!previousAncestor) {
        return {
          ancestorIds: [],
        };
      }
      return {
        ancestorIds: [],
        openOracleId: previousAncestor,
      };
    });
  };

  // Oracle Collection Dialog
  const [oracleCollectionDialogState, setOracleCollectionDialogState] =
    useState<{
      open: boolean;
      oracleId?: { dataswornId: string; dbId: string };
    }>({ open: false });
  const openCollectionDialog = (ids?: {
    dataswornId: string;
    dbId: string;
  }) => {
    setOracleCollectionDialogState({ open: true, oracleId: ids });
  };
  const closeCollectionDialog = () => {
    setOracleCollectionDialogState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  // Sub Collection Filtration
  const oracleCollections = openOracleState.openOracleId
    ? openOracleCollection?.oracle_type === "tables"
      ? openOracleCollection.collections ?? {}
      : {}
    : oracles;

  const filteredCollections: Record<string, Datasworn.OracleCollection> = {
    ...oracleCollections,
  };

  const tableCollectionMap = useOracleCollectionMap([homebrewId]);

  const sortedCollectionIds = Object.keys(oracleCollections)
    .filter((k) => oracleCollections[k].oracle_type === "tables")
    .sort((k1, k2) =>
      oracleCollections[k1].name.localeCompare(oracleCollections[k2].name)
    );
  sortedCollectionIds.forEach((k) => {
    filteredCollections[k] = oracleCollections[
      k
    ] as Datasworn.OracleTablesCollection;
  });

  // If the current collection enhances another, we still need to add it
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

  const collectionDbPath = openOracleState.ancestorIds
    .map((id) => `${id.dbId}.collections.`)
    .join("");

  return (
    <Stack spacing={2}>
      {openOracleState.openOracleId && (
        <Breadcrumbs aria-label={"Oracle Breadcrumbs"}>
          <Link
            component={"button"}
            underline='hover'
            color='inherit'
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
          <Typography color='text.primary'>
            {openOracleCollection?.name}
          </Typography>
        </Breadcrumbs>
      )}
      {openOracleState.openOracleId?.dataswornId && openOracleCollection && (
        <OracleInfoSection
          homebrewId={homebrewId}
          oracle={openOracleCollection}
          openCollectionDialog={() => {
            openCollectionDialog(
              openOracleState.openOracleId
                ? {
                    dataswornId: openOracleState.openOracleId.dataswornId,
                    dbId: openOracleState.openOracleId.dbId,
                  }
                : undefined
            );
          }}
          dbPath={collectionDbPath}
          dbKey={openOracleState.openOracleId.dbId}
          closeCurrentOracleCollection={goUpOneCollectionLevel}
        />
      )}
      {openOracleState.openOracleId && (
        <OracleTablesSection
          homebrewId={homebrewId}
          collections={
            openOracleCollection?.oracle_type === "tables"
              ? openOracleCollection.collections ?? {}
              : {}
          }
          rollables={openOracleCollection?.contents ?? {}}
          dbPath={collectionDbPath}
          parentCollectionKey={
            // If we are not at the root and we are not editing an oracle, set the parent
            openOracleState.openOracleId?.dbId &&
            !oracleCollectionDialogState.oracleId
              ? openOracleState.openOracleId.dbId
              : ""
          }
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
                  ] as Datasworn.OracleTablesCollection,
                  key: oracleCollectionDialogState.oracleId.dbId,
                }
              : undefined
            : undefined
        }
        open={oracleCollectionDialogState.open}
        onClose={closeCollectionDialog}
        collections={filteredCollections}
        dbPath={collectionDbPath}
        parentCollectionKey={
          // If we are not at the root and we are not editing an oracle, set the parent
          openOracleState.openOracleId?.dbId &&
          !oracleCollectionDialogState.oracleId
            ? openOracleState.openOracleId.dbId
            : ""
        }
      />
    </Stack>
  );
}
