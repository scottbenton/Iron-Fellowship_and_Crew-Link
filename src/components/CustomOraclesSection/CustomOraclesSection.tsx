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

export interface CustomOracleSectionProps {
  customOracles?: StoredOracle[];
}

export function CustomOracleSection(props: CustomOracleSectionProps) {
  const { customOracles } = props;

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
        "Are you sure you want to delete this oracle? This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        removeCustomOracle(oracleId).catch();
      })
      .catch();
  };
  return (
    <Box>
      <SectionHeading label={"Custom Oracles"} />
      {Array.isArray(customOracles) ? (
        <Stack spacing={2} px={2} mt={1}>
          <Card variant={"outlined"}>
            <List disablePadding>
              {customOracles.map((oracle) => (
                <ListItem
                  dense
                  key={oracle.name}
                  sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  })}
                >
                  <ListItemText>{oracle.name}</ListItemText>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setCurrentlyEditingOracle(oracle);
                        setIsAddOracleDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(oracle.$id, oracle)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
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
