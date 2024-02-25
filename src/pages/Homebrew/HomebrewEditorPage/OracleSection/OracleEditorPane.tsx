import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  StoredOracleCollection,
  StoredOracleTable,
} from "types/homebrew/HomebrewOracles.type";
import { OracleCollectionsSection } from "./Sections/OracleCollectionsSection";
import { OracleTablesCollectionDialog } from "./Sections/OracleCollectionsSection/OracleTablesCollectionDialog";
import { OracleInfoSection } from "./Sections/OracleInfoSection";
import { OracleTablesSection } from "./Sections/OracleTablesSection";

export interface OracleEditorPaneProps {
  homebrewId: string;
  oracleCollections: Record<string, StoredOracleCollection>;
  oracleTables: Record<string, StoredOracleTable>;
}

function getBreadcrumbs(
  oracleCollectionId: string | undefined,
  oracleCollections: Record<string, StoredOracleCollection>
) {
  const breadcrumbs: {
    label: string;
    id: string | undefined;
    readOnly?: boolean;
  }[] = [];
  if (oracleCollectionId) {
    let collection = oracleCollections[oracleCollectionId];
    if (collection) {
      breadcrumbs.push({
        label: collection.label,
        id: undefined,
        readOnly: true,
      });
      while (collection?.parentOracleCollectionId) {
        const collectionId = collection.parentOracleCollectionId;
        collection = oracleCollections[collectionId];
        if (collection) {
          breadcrumbs.push({
            label: collection.label,
            id: collectionId,
          });
        }
      }
    }
  }
  breadcrumbs.push({
    label: "Collections",
    id: undefined,
    readOnly: breadcrumbs.length === 0,
  });
  return breadcrumbs.reverse();
}

export function OracleEditorPane(props: OracleEditorPaneProps) {
  const { homebrewId, oracleCollections, oracleTables } = props;

  const [openCollectionId, setOpenCollectionId] = useState<string>();
  const [collectionDialogState, setCollectionDialogState] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const breadcrumbs = getBreadcrumbs(openCollectionId, oracleCollections);

  return (
    <Stack spacing={2}>
      <Breadcrumbs aria-label={"Oracle Breadcrumbs"}>
        {breadcrumbs.map((breadcrumb, index) =>
          breadcrumb.readOnly ? (
            <Typography key={index} color='text.primary'>
              {breadcrumb.label}
            </Typography>
          ) : (
            <Link
              key={index}
              component={"button"}
              underline='hover'
              color='inherit'
              sx={{ lineHeight: "1rem" }}
              onClick={() => setOpenCollectionId(breadcrumb.id)}
            >
              {breadcrumb.label}
            </Link>
          )
        )}
      </Breadcrumbs>
      {openCollectionId && oracleCollections[openCollectionId] && (
        <OracleInfoSection
          homebrewId={homebrewId}
          oracleCollectionId={openCollectionId}
          oracleCollection={oracleCollections[openCollectionId]}
          openCollectionDialog={() =>
            setCollectionDialogState({
              open: true,
              id: openCollectionId,
            })
          }
          closeCurrentOracleCollection={() =>
            setOpenCollectionId(breadcrumbs[breadcrumbs.length - 1].id)
          }
        />
      )}
      <OracleCollectionsSection
        oracleCollections={oracleCollections}
        openCollectionId={openCollectionId}
        openCollection={setOpenCollectionId}
        openCreateCollectionDialog={() =>
          setCollectionDialogState({ open: true })
        }
      />
      {openCollectionId && (
        <OracleTablesSection
          homebrewId={homebrewId}
          tables={oracleTables}
          parentCollectionKey={openCollectionId}
        />
      )}
      <OracleTablesCollectionDialog
        open={collectionDialogState.open}
        onClose={() => setCollectionDialogState({ open: false })}
        homebrewId={homebrewId}
        collections={oracleCollections}
        parentCollectionId={openCollectionId}
        existingCollectionId={collectionDialogState.id}
      />
    </Stack>
  );
}
