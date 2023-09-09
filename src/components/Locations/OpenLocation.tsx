import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLayoutEffect, useRef } from "react";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/SectionHeading";
import { LocationNameInput } from "./LocationNameInput";
import { DebouncedOracleInput } from "../DebouncedOracleInput";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { ImageUploader } from "components/ImageUploader/ImageUploader";
import { useStore } from "stores/store";
import { useListenToCurrentLocation } from "stores/world/currentWorld/locations/useListenToCurrentLocation";

export interface OpenLocationProps {
  isWorldOwner: boolean;
  worldId: string;
  locationId: string;
  location: LocationDocumentWithGMProperties;
  closeLocation: () => void;
  canShowImages?: boolean;
  isSinglePlayer?: boolean;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    isWorldOwner,
    worldId,
    locationId,
    location,
    closeLocation,
    canShowImages,
    isSinglePlayer,
  } = props;

  useListenToCurrentLocation(locationId);

  const confirm = useConfirm();

  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
  );
  const updateLocationGMProperties = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.updateLocationGMProperties
  );
  const updateLocationGMNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.updateLocationGMNotes
  );
  const deleteLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.deleteLocation
  );
  const updateLocationNotes = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.updateLocationNotes
  );
  const uploadLocationImage = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.uploadLocationImage
  );

  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialLoadRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (initialLoadRef.current && nameInputRef.current) {
      if (location.name === "New Location") {
        nameInputRef.current.select();
      }
      initialLoadRef.current = false;
    }
  }, [location]);

  const handleLocationDelete = () => {
    confirm({
      title: `Delete ${location.name}`,
      description:
        "Are you sure you want to delete this location? It will be deleted from ALL of your characters and campaigns that use this world. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteLocation(locationId)
          .catch(() => {})
          .then(() => {
            closeLocation();
          });
      })
      .catch(() => {});
  };

  return (
    <Box
      overflow={"auto"}
      bgcolor={(theme) => theme.palette.background.paper}
      width={"100%"}
    >
      {canShowImages && (
        <ImageUploader
          title={location.name}
          src={location.imageUrl}
          handleFileUpload={(image) =>
            uploadLocationImage(locationId, image).catch(() => {})
          }
          handleClose={closeLocation}
        />
      )}
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={(theme) => ({
          px: 1,
          py: 1,
        })}
      >
        <IconButton onClick={() => closeLocation()}>
          <BackIcon />
        </IconButton>
        <LocationNameInput
          inputRef={nameInputRef}
          initialName={location.name}
          updateName={(newName) =>
            updateLocation(locationId, { name: newName }).catch(() => {})
          }
        />
        <IconButton onClick={() => handleLocationDelete()}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box
        sx={(theme) => ({
          mt: 1,
          px: 2,
          [theme.breakpoints.up("md")]: { px: 3 },
        })}
      >
        <Grid
          container
          spacing={2}
          sx={{ mb: 2, mt: isSinglePlayer || !isWorldOwner ? 0 : -2 }}
        >
          {isWorldOwner && (
            <>
              {!isSinglePlayer && (
                <>
                  <Grid item xs={12}>
                    <SectionHeading label={"GM Only"} breakContainer />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity={"info"}>
                      Information in this section will not be shared with your
                      players.
                    </Alert>
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Description"}
                  initialValue={location?.gmProperties?.descriptor ?? ""}
                  updateValue={(descriptor) =>
                    updateLocationGMProperties(locationId, {
                      descriptor,
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/place/descriptor"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Trouble"}
                  initialValue={location?.gmProperties?.trouble ?? ""}
                  updateValue={(trouble) => {
                    updateLocationGMProperties(locationId, { trouble }).catch(
                      () => {}
                    );
                  }}
                  oracleTableId={"ironsworn/oracles/settlement/trouble"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Location Features"}
                  initialValue={location?.gmProperties?.locationFeatures ?? ""}
                  updateValue={(locationFeatures) => {
                    updateLocationGMProperties(locationId, {
                      locationFeatures,
                    }).catch(() => {});
                  }}
                  oracleTableId={"ironsworn/oracles/place/location"}
                />
              </Grid>
              {!isSinglePlayer && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ alignItems: "center", display: "flex" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={location.sharedWithPlayers ?? false}
                        onChange={(evt, value) =>
                          updateLocation(locationId, {
                            sharedWithPlayers: value,
                          }).catch(() => {})
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RtcRichTextEditor
                  id={locationId}
                  roomPrefix={`iron-fellowship-${worldId}-location-gmnotes-`}
                  documentPassword={worldId}
                  onSave={updateLocationGMNotes}
                  initialValue={location.gmProperties?.gmNotes}
                />
              </Grid>
            </>
          )}
          {!isSinglePlayer && (
            <>
              {isWorldOwner && (
                <>
                  <Grid item xs={12}>
                    <SectionHeading
                      label={"GM & Player Notes"}
                      breakContainer
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Alert severity={"info"}>
                      Notes in this section will only be visible to gms &
                      players in campaigns. Notes for singleplayer games should
                      go in the above section.
                    </Alert>
                  </Grid>
                </>
              )}
              {!location.sharedWithPlayers && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    These notes are not yet visible to players because this
                    location is hidden from them.
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                {(location.notes || location.notes === null) && (
                  <RtcRichTextEditor
                    id={locationId}
                    roomPrefix={`iron-fellowship-${worldId}-location-`}
                    documentPassword={worldId}
                    onSave={updateLocationNotes}
                    initialValue={location.notes || undefined}
                  />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
