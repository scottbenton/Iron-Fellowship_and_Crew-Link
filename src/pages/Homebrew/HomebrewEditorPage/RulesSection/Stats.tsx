import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useState } from "react";
import { StoredRules } from "types/HomebrewCollection.type";

export interface StatsProps {
  stats: StoredRules["stats"];
}

export function Stats(props: StatsProps) {
  const { stats } = props;

  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string>();

  const [editingStatLabel, setEditingStatLabel] = useState("");
  const [editingStatDescription, setEditingStatDescription] = useState("");

  return (
    <>
      {Object.keys(stats).length === 0 && (
        <Typography color={"textSecondary"}>No Stats Found</Typography>
      )}
      {Object.keys(stats).map((statKey) => (
        <Box key={statKey}>{stats[statKey].label}</Box>
      ))}
      <Button
        variant={"outlined"}
        color={"inherit"}
        onClick={() => {
          setStatDialogOpen(true);
          setEditingStatKey(undefined);
        }}
      >
        Add Stat
      </Button>
      <Dialog open={statDialogOpen} onClose={() => setStatDialogOpen(false)}>
        <DialogTitleWithCloseButton onClose={() => setStatDialogOpen(false)}>
          {editingStatKey ? "Edit" : "Add"} Stat
        </DialogTitleWithCloseButton>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label={"Stat Label"}
              helperText={"Ex: edge, heart"}
              value={editingStatLabel}
              onChange={(evt) => setEditingStatLabel(evt.currentTarget.value)}
            />
            <TextField
              label={"Stat Description"}
              value={editingStatDescription}
              onChange={(evt) =>
                setEditingStatDescription(evt.currentTarget.value)
              }
            />
            <Box>
              <Typography variant={"overline"}>Example</Typography>
              <StatComponent
                label={editingStatLabel || "Label"}
                value={1}
                disableRoll
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color={"inherit"} onClick={() => setStatDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant={"contained"}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
