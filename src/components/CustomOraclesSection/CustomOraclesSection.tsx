import { Box, Button, Card, LinearProgress, List, Stack } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useState } from "react";
import { StoredOracle } from "types/Oracles.type";
import { CustomOracleDialog } from "./CustomOracleDialog";
import { useConfirm } from "material-ui-confirm";
import { CustomOraclesListItem } from "./CustomOraclesListItem";
import { useStore } from "stores/store";

export interface CustomOracleSectionProps {
  customOracles?: StoredOracle[];
  hiddenOracleIds?: string[];
  showOrHideCustomOracle: (
    oracleId: string,
    hidden: boolean
  ) => Promise<boolean | void>;
}

export function CustomOracleSection(props: CustomOracleSectionProps) {
  const { customOracles, hiddenOracleIds, showOrHideCustomOracle } = props;

  const confirm = useConfirm();

  const [isAddOracleDialogOpen, setIsAddOracleDialogOpen] =
    useState<boolean>(false);
  const [currentlyEditingOracle, setCurrentlyEditingOracle] =
    useState<StoredOracle>();

  const addCustomOracle = useStore((store) => store.settings.addCustomOracle);
  const updateCustomOracle = useStore(
    (store) => store.settings.updateCustomOracle
  );
  const removeCustomOracle = useStore(
    (store) => store.settings.removeCustomOracle
  );

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
          {customOracles.length > 0 && (
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
          )}
          <div>
            <Button
              color={"inherit"}
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
