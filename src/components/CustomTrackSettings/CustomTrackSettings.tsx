import {
  Box,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useState } from "react";
import { AddCustomTrackDialog } from "./AddCustomTrackDialog";
import { useStore } from "stores/store";
import { deleteField } from "firebase/firestore";
import { CustomTrack } from "types/CustomTrackSettings.type";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function CustomTrackSettings() {
  const [customTrackDialogOpen, setCustomTrackDialogOpen] =
    useState<boolean>(false);

  const [currentlyEditingTrack, setCurrentlyEditingTrack] =
    useState<CustomTrack>();

  const customTracks = useStore((store) => store.settings.customTracks);

  const updateSettings = useStore((store) => store.settings.updateSettings);

  const addCustomTrack = (track: CustomTrack) => {
    const order =
      customTracks.length > 0
        ? customTracks[customTracks.length - 1].order + 1
        : 0;

    if (customTracks.length > 0) {
      return updateSettings(
        {
          [`customTracks.${track.label}`]: {
            ...track,
            order,
          },
        },
        true
      );
    } else {
      return updateSettings({
        customTracks: {
          [track.label]: { ...track, order },
        },
      });
    }
  };

  const deleteCustomTrack = (track: CustomTrack) => {
    return updateSettings(
      {
        [`customTracks.${track.label}`]: deleteField(),
      },
      true
    ).catch(() => {});
  };

  return (
    <>
      <SectionHeading label="Custom Tracks" />
      {customTracks.length > 0 && (
        <Box px={2}>
          <Card variant={"outlined"}>
            <List disablePadding>
              {customTracks.map((customTrack) => (
                <ListItem
                  dense
                  key={customTrack.label}
                  sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:nth-of-type(even)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  })}
                >
                  <ListItemText primary={customTrack.label} />
                  <Box>
                    <Tooltip title={"Edit Custom Track"}>
                      <IconButton
                        onClick={() => {
                          setCurrentlyEditingTrack(customTrack);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Delete Custom Track"}>
                      <IconButton
                        onClick={() => deleteCustomTrack(customTrack)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Card>
        </Box>
      )}
      <Box px={2}>
        <Button
          variant={"outlined"}
          color={"inherit"}
          onClick={() => setCustomTrackDialogOpen(true)}
        >
          Add Custom Track
        </Button>
      </Box>
      {(currentlyEditingTrack || customTrackDialogOpen) && (
        <AddCustomTrackDialog
          open={true}
          onClose={() => {
            setCustomTrackDialogOpen(false);
            setCurrentlyEditingTrack(undefined);
          }}
          initialTrack={currentlyEditingTrack}
          addCustomTrack={addCustomTrack}
        />
      )}
    </>
  );
}
