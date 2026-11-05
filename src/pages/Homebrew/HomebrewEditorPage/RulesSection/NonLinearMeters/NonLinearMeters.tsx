import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";
import ViewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useStore } from "stores/store";
import { useConfirm } from "material-ui-confirm";
import { NonLinearMeterDialog } from "./NonLinearMeterDialog";
import { ClampedMarkdownRenderer } from "components/shared/ClampedMarkdownRenderer";
import { NonLinearMeterPreviewDialog } from "./NonLinearMeterPreviewDialog";

export interface NonLinearMetersProps {
  homebrewId: string;
  isEditor: boolean;
}

export function NonLinearMeters(props: NonLinearMetersProps) {
  const { homebrewId, isEditor } = props;

  const confirm = useConfirm();
  const nonLinearMeters = useStore(
    (store) =>
      store.homebrew.collections[homebrewId]?.nonLinearMeters?.data ?? {}
  );
  const nonLinearMetersLoading = useStore(
    (store) => !store.homebrew.collections[homebrewId]?.nonLinearMeters?.loaded
  );

  const [nonLinearMeterDialogOpen, setNonLinearMeterDialogOpen] =
    useState(false);
  const [editingNonLinearMeterKey, setEditingNonLinearMeterKey] = useState<
    string | undefined
  >(undefined);
  const [viewingNonLinearMeterKey, setViewingNonLinearMeterKey] = useState<
    string | undefined
  >(undefined);

  const createNonLinearMeter = useStore(
    (store) => store.homebrew.createNonLinearMeter
  );
  const updateNonLinearMeter = useStore(
    (store) => store.homebrew.updateNonLinearMeter
  );
  const deleteNonLinearMeter = useStore(
    (store) => store.homebrew.deleteNonLinearMeter
  );

  if (nonLinearMetersLoading) {
    return <></>;
  }

  const handleDialogOutput = (meter: HomebrewNonLinearMeterDocument) => {
    if (editingNonLinearMeterKey) {
      return updateNonLinearMeter(editingNonLinearMeterKey, meter);
    } else {
      return createNonLinearMeter(meter);
    }
  };

  const handleDelete = (meterId: string) => {
    confirm({
      title: `Delete ${nonLinearMeters[meterId].label}`,
      description:
        "Are you sure you want to delete this meter? It will be deleted from ALL of your custom content that references this meter.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteNonLinearMeter(meterId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {Object.keys(nonLinearMeters).length === 0 ? (
        <Typography color={"text.secondary"}>
          No Non Linear Meters Found
        </Typography>
      ) : (
        <List
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(12, 1fr)",
            pl: 0,
            my: 0,
            listStyle: "none",
          }}
        >
          {Object.keys(nonLinearMeters)
            .sort((c1, c2) =>
              nonLinearMeters[c1].label.localeCompare(nonLinearMeters[c2].label)
            )
            .map((meterKey) => (
              <ListItem
                key={meterKey}
                sx={(theme) => ({
                  gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                })}
              >
                <ListItemText
                  secondaryTypographyProps={{ component: "span" }}
                  primary={nonLinearMeters[meterKey].label}
                  secondary={
                    <ClampedMarkdownRenderer
                      markdown={nonLinearMeters[meterKey].description ?? ""}
                      inheritColor
                    />
                  }
                />
                <Box display={"flex"}>
                  {isEditor ? (
                    <>
                      <Tooltip title={"Edit"}>
                        <IconButton
                          aria-label={`Edit ${nonLinearMeters[meterKey].label}`}
                          onClick={() => {
                            setEditingNonLinearMeterKey(meterKey);
                            setNonLinearMeterDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={"Delete"}>
                        <IconButton
                          aria-label={`Delete ${nonLinearMeters[meterKey].label}`}
                          onClick={() => handleDelete(meterKey)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip title={"Preview"}>
                      <IconButton
                        aria-label={`Preview ${nonLinearMeters[meterKey].label}`}
                        onClick={() => {
                          setViewingNonLinearMeterKey(meterKey);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </ListItem>
            ))}
        </List>
      )}
      {isEditor && (
        <Button
          variant={"outlined"}
          color={"inherit"}
          onClick={() => {
            setNonLinearMeterDialogOpen(true);
            setEditingNonLinearMeterKey(undefined);
          }}
        >
          Add Non Linear Meter
        </Button>
      )}
      {viewingNonLinearMeterKey && (
        <NonLinearMeterPreviewDialog
          open={!!viewingNonLinearMeterKey}
          onClose={() => setViewingNonLinearMeterKey(undefined)}
          meter={nonLinearMeters[viewingNonLinearMeterKey]}
        />
      )}
      <NonLinearMeterDialog
        homebrewId={homebrewId}
        nonLinearMeters={nonLinearMeters}
        open={nonLinearMeterDialogOpen}
        onClose={() => setNonLinearMeterDialogOpen(false)}
        onSave={handleDialogOutput}
        editingNonLinearMeterKey={editingNonLinearMeterKey}
      />
    </>
  );
}
