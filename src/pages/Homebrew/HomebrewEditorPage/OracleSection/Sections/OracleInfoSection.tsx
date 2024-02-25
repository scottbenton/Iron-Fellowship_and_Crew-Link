import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { useStore } from "stores/store";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";

export interface OracleInfoSectionProps {
  homebrewId: string;
  oracleCollectionId: string;
  oracleCollection: StoredOracleCollection;
  openCollectionDialog: () => void;
  closeCurrentOracleCollection: () => void;
}

export function OracleInfoSection(props: OracleInfoSectionProps) {
  const {
    homebrewId,
    oracleCollectionId,
    oracleCollection,
    openCollectionDialog,
    closeCurrentOracleCollection,
  } = props;

  const deleteOracleCollection = useStore(
    (store) => store.homebrew.deleteOracleCollection
  );

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDelete = () => {
    setIsDeleteLoading(true);
    deleteOracleCollection(homebrewId, oracleCollectionId)
      .then(() => {
        closeCurrentOracleCollection();
      })
      .catch(() => {})
      .finally(() => {
        setIsDeleteLoading(false);
      });
  };

  return (
    <>
      <SectionHeading
        label={oracleCollection.label}
        action={
          <div>
            <Button color={"inherit"} onClick={openCollectionDialog}>
              Edit
            </Button>
            <LoadingButton
              color={"inherit"}
              onClick={handleDelete}
              loading={isDeleteLoading}
            >
              Delete
            </LoadingButton>
          </div>
        }
        floating
      />
      {oracleCollection.description ? (
        <Box px={2}>
          <MarkdownRenderer markdown={oracleCollection.description} />
        </Box>
      ) : null}
    </>
  );
}
