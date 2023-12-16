import { Button, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { StoredRules, StoredStat } from "types/HomebrewCollection.type";
import { StatDialog } from "./StatDialog";
import { useStore } from "stores/store";
import { deleteField } from "firebase/firestore";
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";

export interface StatsProps {
  homebrewId: string;
  stats: StoredRules["stats"];
}

export function Stats(props: StatsProps) {
  const { homebrewId, stats } = props;

  const confirm = useConfirm();

  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string | undefined>(
    undefined
  );

  const updateRules = useStore((store) => store.homebrew.updateExpansionRules);
  const addStat = (statId: string, stat: StoredStat) => {
    return updateRules(homebrewId, { stats: { [statId]: stat } });
  };
  const deleteStat = (statId: string) => {
    return updateRules(homebrewId, { stats: { [statId]: deleteField() } });
  };

  const handleDelete = (statId: string) => {
    confirm({
      title: `Delete ${stats[statId].label}`,
      description:
        "Are you sure you want to delete this custom stat? It will be deleted from ALL of your custom content that references this stat.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteStat(statId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {Object.keys(stats).length === 0 && (
        <Typography color={"textSecondary"}>No Stats Found</Typography>
      )}
      <Stack spacing={1} direction={"row"}>
        {Object.keys(stats)
          .sort((s1, s2) => stats[s1].label.localeCompare(stats[s2].label))
          .map((statKey) => (
            <Chip
              label={stats[statKey].label}
              key={statKey}
              sx={{ textTransform: "capitalize" }}
              onDelete={() => handleDelete(statKey)}
              icon={<EditIcon />}
              onClick={() => {
                setStatDialogOpen(true);
                setEditingStatKey(statKey);
              }}
            />
          ))}
      </Stack>
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
      <StatDialog
        open={statDialogOpen}
        onSave={addStat}
        onClose={() => setStatDialogOpen(false)}
        stats={stats}
        editingStatKey={editingStatKey}
      />
    </>
  );
}
