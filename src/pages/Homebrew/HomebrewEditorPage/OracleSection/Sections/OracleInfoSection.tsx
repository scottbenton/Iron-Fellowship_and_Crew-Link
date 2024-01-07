import { OracleCollection } from "@datasworn/core";
import { Box, Button } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { SectionHeading } from "components/shared/SectionHeading";

export interface OracleInfoSectionProps {
  oracle: OracleCollection;
  openCollectionDialog: () => void;
}

export function OracleInfoSection(props: OracleInfoSectionProps) {
  const { oracle, openCollectionDialog } = props;

  return (
    <>
      <SectionHeading
        label={oracle.name}
        action={
          <div>
            <Button color={"inherit"} onClick={openCollectionDialog}>
              Edit
            </Button>
            <Button color={"inherit"}>Delete</Button>
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
