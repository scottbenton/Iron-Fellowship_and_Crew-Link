import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ClampedMarkdownRenderer } from "components/shared/ClampedMarkdownRenderer";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useStore } from "stores/store";
import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LegacyTrackDialog } from "./LegacyTrackDialog";

export interface LegacyTracksProps {
  homebrewId: string;
}

export function LegacyTracks(props: LegacyTracksProps) {
  const { homebrewId } = props;

  const legacyTracks = useStore(
    (store) => store.homebrew.collections[homebrewId]?.legacyTracks?.data ?? {}
  );
  const isLoading = useStore(
    (store) => !store.homebrew.collections[homebrewId]?.legacyTracks?.loaded
  );

  const confirm = useConfirm();

  const [legacyTracksDialogOpen, setLegacyTracksDialogOpen] = useState(false);
  const [editingLegacyTrackKey, setEditingLegacyTrackKey] = useState<
    string | undefined
  >(undefined);

  const createLegacyTrack = useStore(
    (store) => store.homebrew.createLegacyTrack
  );
  const updateLegacyTrack = useStore(
    (store) => store.homebrew.updateLegacyTrack
  );
  const deleteLegacyTrack = useStore(
    (store) => store.homebrew.deleteLegacyTrack
  );
  const createOrUpdateLegacyTrack = (legacyTrack: StoredLegacyTrack) => {
    if (editingLegacyTrackKey) {
      return updateLegacyTrack(editingLegacyTrackKey, legacyTrack);
    } else {
      return createLegacyTrack(legacyTrack);
    }
  };

  const handleDelete = (legacyTrackId: string) => {
    confirm({
      title: `Delete ${legacyTracks[legacyTrackId].label}`,
      description: "Are you sure you want to delete this track?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteLegacyTrack(legacyTrackId).catch(() => {});
      })
      .catch(() => {});
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {Object.keys(legacyTracks).length === 0 ? (
        <Typography color={"textSecondary"}>No Tracks Found</Typography>
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
          {Object.keys(legacyTracks)
            .sort((s1, s2) =>
              legacyTracks[s1].label.localeCompare(legacyTracks[s2].label)
            )
            .map((legacyTrackKey) => (
              <ListItem
                key={legacyTrackKey}
                sx={(theme) => ({
                  gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                })}
              >
                <ListItemText
                  secondaryTypographyProps={{ component: "span" }}
                  primary={legacyTracks[legacyTrackKey].label}
                  secondary={
                    <ClampedMarkdownRenderer
                      markdown={legacyTracks[legacyTrackKey].description ?? ""}
                      inheritColor
                    />
                  }
                />
                <Box display={"flex"}>
                  <IconButton
                    onClick={() => {
                      setLegacyTracksDialogOpen(true);
                      setEditingLegacyTrackKey(legacyTrackKey);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(legacyTrackKey)}>
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
          setLegacyTracksDialogOpen(true);
          setEditingLegacyTrackKey(undefined);
        }}
      >
        Add Legacy Track
      </Button>
      <LegacyTrackDialog
        homebrewId={homebrewId}
        open={legacyTracksDialogOpen}
        onSave={createOrUpdateLegacyTrack}
        onClose={() => setLegacyTracksDialogOpen(false)}
        legacyTracks={legacyTracks}
        editingLegacyTrackKey={editingLegacyTrackKey}
      />
    </>
  );
}
