import { Datasworn } from "@datasworn/core";
import { Box, Button } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { SectionHeading } from "components/shared/SectionHeading";
import { deleteField } from "firebase/firestore";
import { useStore } from "stores/store";

export interface OracleInfoSectionProps {
  homebrewId: string;
  oracle: Datasworn.OracleCollection;
  openCollectionDialog: () => void;
  dbKey: string;
  dbPath: string;
  closeCurrentOracleCollection: () => void;
}

export function OracleInfoSection(props: OracleInfoSectionProps) {
  const {
    homebrewId,
    oracle,
    openCollectionDialog,
    dbPath,
    dbKey,
    closeCurrentOracleCollection,
  } = props;

  const updateOracles = useStore(
    (store) => store.homebrew.updateExpansionOracles
  );

  const handleDelete = () => {
    const path = dbPath + dbKey;
    return updateOracles(homebrewId, { [path]: deleteField() })
      .then(() => {
        closeCurrentOracleCollection();
      })
      .catch(() => {});
  };

  return (
    <>
      <SectionHeading
        label={oracle.name}
        action={
          <div>
            <Button color={"inherit"} onClick={openCollectionDialog}>
              Edit
            </Button>
            <Button color={"inherit"} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
        floating
      />
      {oracle.description || oracle.summary ? (
        <Box px={2}>
          <MarkdownRenderer
            markdown={oracle.description ?? oracle.summary ?? ""}
          />
        </Box>
      ) : null}
    </>
  );
}
