import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  StoredConditionMeter,
  StoredRules,
} from "types/HomebrewCollection.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useStore } from "stores/store";
import { deleteField } from "firebase/firestore";
import { useConfirm } from "material-ui-confirm";
import { ConditionMeterDialog } from "./ConditionMeterDialog";

export interface ConditionMetersProps {
  homebrewId: string;
  conditionMeters: StoredRules["condition_meters"];
}

export function ConditionMeters(props: ConditionMetersProps) {
  const { homebrewId, conditionMeters } = props;

  const confirm = useConfirm();

  const [conditionMeterDialogOpen, setConditionMeterDialogOpen] =
    useState(false);
  const [editingConditionMeterKey, setEditingConditionMeterKey] = useState<
    string | undefined
  >(undefined);

  const updateRules = useStore((store) => store.homebrew.updateExpansionRules);
  const addConditionMeter = (
    conditionMeterId: string,
    conditionMeter: StoredConditionMeter
  ) => {
    return updateRules(homebrewId, {
      condition_meters: { [conditionMeterId]: conditionMeter },
    });
  };
  const deleteConditionMeter = (conditionMeterId: string) => {
    return updateRules(homebrewId, {
      condition_meters: { [conditionMeterId]: deleteField() },
    });
  };

  const handleDelete = (conditionMeterId: string) => {
    confirm({
      title: `Delete ${conditionMeters[conditionMeterId].label}`,
      description:
        "Are you sure you want to delete this conditon meter? It will be deleted from ALL of your custom content that references this meter.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteConditionMeter(conditionMeterId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {Object.keys(conditionMeters).length === 0 ? (
        <Typography color={"text.secondary"}>
          No Condition Meters Found
        </Typography>
      ) : (
        <List
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            pl: 0,
            my: 0,
            listStyle: "none",
          }}
        >
          {Object.keys(conditionMeters).map((conditionMeterKey) => (
            <ListItem
              key={conditionMeterKey}
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" } }}
              secondaryAction={
                <>
                  <IconButton
                    onClick={() => {
                      setConditionMeterDialogOpen(true);
                      setEditingConditionMeterKey(conditionMeterKey);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(conditionMeterKey)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={conditionMeters[conditionMeterKey].label}
                secondary={conditionMeters[conditionMeterKey].description}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant={"outlined"}
        color={"inherit"}
        onClick={() => {
          setConditionMeterDialogOpen(true);
          setEditingConditionMeterKey(undefined);
        }}
      >
        Add Condition Meter
      </Button>
      <ConditionMeterDialog
        conditionMeters={conditionMeters}
        open={conditionMeterDialogOpen}
        onClose={() => setConditionMeterDialogOpen(false)}
        onSave={addConditionMeter}
        editingConditionMeterKey={editingConditionMeterKey}
      />
    </>
  );
}
