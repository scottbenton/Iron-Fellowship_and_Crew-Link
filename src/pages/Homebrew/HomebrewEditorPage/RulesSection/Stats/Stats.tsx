import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StoredRules, StoredStat } from "types/HomebrewCollection.type";
import { StatDialog } from "./StatDialog";
import { useStore } from "stores/store";
import { deleteField } from "firebase/firestore";
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
      {Object.keys(stats).length === 0 ? (
        <Typography color={"textSecondary"}>No Stats Found</Typography>
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
          {Object.keys(stats).map((statKey) => (
            <ListItem
              key={statKey}
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" } }}
              secondaryAction={
                <>
                  <IconButton
                    onClick={() => {
                      setStatDialogOpen(true);
                      setEditingStatKey(statKey);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(statKey)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={stats[statKey].label}
                secondary={stats[statKey].description}
              />
            </ListItem>
          ))}
        </List>
      )}
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
