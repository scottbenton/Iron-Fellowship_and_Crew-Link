import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useStore } from "stores/store";
import { hexTypeMap } from "../hexTypes";
import { Content } from "./Content";
import { useWorldPermissions } from "../../useWorldPermissions";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { RtcRichTextEditor } from "components/shared/RichTextEditor";
import { NotesSectionHeader } from "../../NotesSectionHeader";

export function SectorLocationDialog() {
  const confirm = useConfirm();

  const worldId = useStore(
    (store) => store.worlds.currentWorld.currentWorldId ?? ""
  );
  const sectorId = useStore(
    (store) => store.worlds.currentWorld.currentWorldSectors.openSectorId ?? ""
  );
  const sharedWithPlayers = useStore((store) => {
    const sectorId = store.worlds.currentWorld.currentWorldSectors.openSectorId;
    return sectorId
      ? store.worlds.currentWorld.currentWorldSectors.sectors[sectorId]
          .sharedWithPlayers
      : false;
  });
  const openLocationId = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationId
  );
  const openLocation = useStore((store) =>
    openLocationId
      ? store.worlds.currentWorld.currentWorldSectors.locations.locations[
          openLocationId
        ]
      : undefined
  );

  const setOpenLocationId = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.setOpenLocationId
  );

  const deleteLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.deleteLocation
  );

  const handleDeleteLocation = () => {
    if (openLocation && openLocationId) {
      confirm({
        title: `Delete ${openLocation?.name || "this Location"}`,
        description:
          "Are you sure you want to delete this location? It will be deleted from ALL characters and campaigns that use this world. This cannot be undone.",
        confirmationText: "Delete",
        confirmationButtonProps: {
          variant: "contained",
          color: "error",
        },
      })
        .then(() => {
          setOpenLocationId(undefined);
          deleteLocation(openLocationId).catch(() => {});
        })
        .catch(() => {});
    }
  };

  const notes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationNotes
  );
  const gmNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations
        .openLocationGMNotes
  );
  const updateNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations
        .updateLocationNotes
  );

  const { showGMFields, showGMTips, isSinglePlayer } = useWorldPermissions();

  if (!openLocation || !openLocationId) return null;

  const { type, name } = openLocation;
  const { Icon, color } = hexTypeMap[type];

  return (
    <Dialog
      open={!!openLocation}
      onClose={() => setOpenLocationId(undefined)}
      fullWidth
      maxWidth={"sm"}
    >
      <DialogTitleWithCloseButton
        onClose={() => setOpenLocationId(undefined)}
        actions={
          showGMFields && (
            <IconButton onClick={() => handleDeleteLocation()}>
              <DeleteIcon />
            </IconButton>
          )
        }
      >
        <Box display={"flex"} alignItems={"center"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            width={40}
            height={40}
            borderRadius={"100%"}
            bgcolor={(theme) => theme.palette.grey[800]}
            mr={2}
          >
            <Icon sx={{ color }} />
          </Box>
          <Typography variant={"h6"}>{name}</Typography>
        </Box>
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Content
            locationId={openLocationId}
            location={openLocation}
            showGMFields={showGMFields}
            showGMTips={showGMTips}
          />
          {showGMFields && (
            <Grid item xs={12}>
              <RtcRichTextEditor
                id={openLocationId}
                roomPrefix={`sector-location-private-${worldId}-${sectorId}-`}
                documentPassword={openLocationId}
                onSave={(locationId, notes, isBeaconRequest) =>
                  updateNotes(locationId, notes, true, isBeaconRequest)
                }
                initialValue={gmNotes}
              />
            </Grid>
          )}
          {!isSinglePlayer && (
            <>
              {showGMTips && (
                <NotesSectionHeader sharedWithPlayers={sharedWithPlayers} />
              )}
              <Grid item xs={12}>
                <RtcRichTextEditor
                  id={openLocationId}
                  roomPrefix={`sector-location-public-${worldId}-${sectorId}-`}
                  documentPassword={openLocationId}
                  onSave={(locationId, notes, isBeaconRequest) =>
                    updateNotes(locationId, notes, false, isBeaconRequest)
                  }
                  initialValue={notes}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={(theme) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paperInlayDarker,
        })}
      >
        <Button
          variant={"contained"}
          onClick={() => setOpenLocationId(undefined)}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
