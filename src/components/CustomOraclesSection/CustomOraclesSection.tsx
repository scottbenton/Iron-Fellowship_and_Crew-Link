import {
  Box,
  Button,
  Card,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { useAddCustomOracle } from "api/user/custom-oracles/addCustomOracle";
import { SectionHeading } from "components/SectionHeading";
import { useState } from "react";
import { StoredOracle } from "types/Oracles.type";
import { CustomOracleDialog } from "./CustomOracleDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdateCustomOracle } from "api/user/custom-oracles/updateCustomOracle";
import { useRemoveCustomOracle } from "api/user/custom-oracles/removeCustomOracle";
import { useConfirm } from "material-ui-confirm";
import { CustomOraclesListItem } from "./CustomOraclesListItem";

export interface CustomOracleSectionProps {
  customOracles?: StoredOracle[];
  hiddenOracleIds?: string[];
  showOrHideCustomOracle: (
    oracleId: string,
    hidden: boolean
  ) => Promise<boolean>;
}

export function CustomOracleSection(props: CustomOracleSectionProps) {
  const { customOracles, hiddenOracleIds, showOrHideCustomOracle } = props;

  const confirm = useConfirm();

  const [isAddOracleDialogOpen, setIsAddOracleDialogOpen] =
    useState<boolean>(false);
  const [currentlyEditingOracle, setCurrentlyEditingOracle] =
    useState<StoredOracle>();

  const { addCustomOracle } = useAddCustomOracle();
  const { updateCustomOracle } = useUpdateCustomOracle();
  const { removeCustomOracle } = useRemoveCustomOracle();

  const handleDelete = (oracleId: string, oracle: StoredOracle) => {
    confirm({
      title: `Delete ${oracle.name}`,
      description:
        "Are you sure you want to delete this oracle? It will be deleted from ALL of your characters and campaigns. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        removeCustomOracle(oracleId).catch(() => {});
      })
      .catch(() => {});
  };
  return (
    <Box>
      <SectionHeading label={"Custom Oracles"} />
      {Array.isArray(customOracles) && Array.isArray(hiddenOracleIds) ? (
        <Stack spacing={2} px={2} mt={1}>
          <Card variant={"outlined"}>
            <List disablePadding>
              {customOracles.map((oracle) => (
                <CustomOraclesListItem
                  key={oracle.$id}
                  oracle={oracle}
                  isVisible={!hiddenOracleIds.includes(oracle.$id)}
                  handleEdit={() => {
                    setCurrentlyEditingOracle(oracle);
                    setIsAddOracleDialogOpen(true);
                  }}
                  handleDelete={() => handleDelete(oracle.$id, oracle)}
                  handleVisibilityToggle={(isVisible) =>
                    showOrHideCustomOracle(oracle.$id, !isVisible)
                  }
                />
              ))}
            </List>
          </Card>
          <div>
            <Button
              variant={"outlined"}
              onClick={() => setIsAddOracleDialogOpen(true)}
            >
              Add Custom Oracle
            </Button>
          </div>
        </Stack>
      ) : (
        <LinearProgress />
      )}
      <CustomOracleDialog
        open={isAddOracleDialogOpen}
        oracle={currentlyEditingOracle}
        onClose={() => setIsAddOracleDialogOpen(false)}
        createCustomOracle={addCustomOracle}
        updateCustomOracle={updateCustomOracle}
      />
    </Box>
  );
}
