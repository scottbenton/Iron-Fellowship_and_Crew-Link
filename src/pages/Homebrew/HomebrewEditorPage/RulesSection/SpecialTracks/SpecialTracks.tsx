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
import { deleteField } from "firebase/firestore";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useStore } from "stores/store";
import {
  StoredRules,
  StoredSpecialTrack,
} from "types/homebrew/HomebrewRules.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SpecialTrackDialog } from "./SpecialTrackDialog";

export interface SpecialTracksProps {
  homebrewId: string;
  specialTracks: StoredRules["special_tracks"];
}

export function SpecialTracks(props: SpecialTracksProps) {
  const { homebrewId, specialTracks } = props;

  const confirm = useConfirm();

  const [specialTracksDialogOpen, setSpecialTracksDialogOpen] = useState(false);
  const [editingSpecialTrackKey, setEditingSpecialTrackKey] = useState<
    string | undefined
  >(undefined);

  const updateRules = useStore((store) => store.homebrew.updateExpansionRules);
  const addSpecialTrack = (
    specialTrackId: string,
    specialTrack: StoredSpecialTrack
  ) => {
    return updateRules(homebrewId, {
      special_tracks: { [specialTrackId]: specialTrack },
    });
  };
  const deleteSpecialTrack = (specialTrackId: string) => {
    return updateRules(homebrewId, {
      special_tracks: { [specialTrackId]: deleteField() },
    });
  };

  const handleDelete = (specialTrackId: string) => {
    confirm({
      title: `Delete ${specialTracks[specialTrackId].label}`,
      description: "Are you sure you want to delete this track?",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteSpecialTrack(specialTrackId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      {Object.keys(specialTracks).length === 0 ? (
        <Typography color={"textSecondary"}>No Tracks Found</Typography>
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
          {Object.keys(specialTracks)
            .sort((s1, s2) =>
              specialTracks[s1].label.localeCompare(specialTracks[s2].label)
            )
            .map((specialTrackKey) => (
              <ListItem
                key={specialTrackKey}
                sx={{
                  gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" },
                }}
              >
                <ListItemText
                  secondaryTypographyProps={{ component: "span" }}
                  primary={specialTracks[specialTrackKey].label}
                  secondary={
                    <ClampedMarkdownRenderer
                      markdown={specialTracks[specialTrackKey].description}
                      inheritColor
                    />
                  }
                />
                <Box display={"flex"}>
                  <IconButton
                    onClick={() => {
                      setSpecialTracksDialogOpen(true);
                      setEditingSpecialTrackKey(specialTrackKey);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(specialTrackKey)}>
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
          setSpecialTracksDialogOpen(true);
          setEditingSpecialTrackKey(undefined);
        }}
      >
        Add Legacy Track
      </Button>
      <SpecialTrackDialog
        open={specialTracksDialogOpen}
        onSave={addSpecialTrack}
        onClose={() => setSpecialTracksDialogOpen(false)}
        specialTracks={specialTracks}
        editingSpecialTrackKey={editingSpecialTrackKey}
      />
    </>
  );
}
