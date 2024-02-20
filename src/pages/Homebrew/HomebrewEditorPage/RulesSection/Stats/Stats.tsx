import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StoredStat } from "types/homebrew/HomebrewRules.type";
import { StatDialog } from "./StatDialog";
import { useStore } from "stores/store";
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClampedMarkdownRenderer } from "components/shared/ClampedMarkdownRenderer";

export interface StatsProps {
  homebrewId: string;
}

export function Stats(props: StatsProps) {
  const { homebrewId } = props;

  const confirm = useConfirm();

  const stats = useStore(
    (store) => store.homebrew.collections[homebrewId]?.stats?.data ?? {}
  );
  const isLoading = useStore(
    (store) => !store.homebrew.collections[homebrewId].stats?.loaded
  );

  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [editingStatKey, setEditingStatKey] = useState<string | undefined>(
    undefined
  );

  const addStat = useStore((store) => store.homebrew.createStat);
  const updateStat = useStore((store) => store.homebrew.updateStat);
  const deleteStat = useStore((store) => store.homebrew.deleteStat);

  const handleStatDialogSave = (stat: StoredStat) => {
    if (editingStatKey) {
      return updateStat(editingStatKey, stat);
    } else {
      return addStat(stat);
    }
  };

  const handleDelete = (statId: string) => {
    if (stats[statId]) {
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
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {Object.keys(stats).length === 0 ? (
        <Typography color={"textSecondary"}>No Stats Found</Typography>
      ) : (
        <List
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 2,
            pl: 0,
            my: 0,
            listStyle: "none",
          }}
        >
          {Object.keys(stats)
            .sort((s1, s2) => stats[s1].label.localeCompare(stats[s2].label))
            .map((statKey) => (
              <ListItem
                key={statKey}
                sx={(theme) => ({
                  gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                })}
              >
                <ListItemText
                  secondaryTypographyProps={{ component: "span" }}
                  primary={stats[statKey].label}
                  secondary={
                    <ClampedMarkdownRenderer
                      markdown={stats[statKey].description ?? ""}
                      inheritColor
                    />
                  }
                />
                <Box display={"flex"}>
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
                </Box>
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
        homebrewId={homebrewId}
        open={statDialogOpen}
        onSave={handleStatDialogSave}
        onClose={() => setStatDialogOpen(false)}
        stats={stats}
        editingStatKey={editingStatKey}
      />
    </>
  );
}
