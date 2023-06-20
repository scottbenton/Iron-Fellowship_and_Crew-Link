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
import { useUpdateLocation } from "api/worlds/locations/updateLocation";
import { useDeleteLocation } from "api/worlds/locations/deleteLocation";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/SectionHeading";
import { RichTextEditorNoTitle } from "components/RichTextEditor";
import { LocationNameInput } from "./LocationNameInput";
import { useAuth } from "providers/AuthProvider";
import { useUpdateLocationGMProperties } from "api/worlds/locations/updateLocationGMProperties";
import { useUpdateLocationGMNotes } from "api/worlds/locations/updateLocationGMNotes";
import { DebouncedOracleInput } from "../DebouncedOracleInput";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { useUpdateLocationNotes } from "api/worlds/locations/updateLocationNotes";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";
import { ImageUploader } from "components/ImageUploader/ImageUploader";
import { useUploadLocationImage } from "api/worlds/locations/uploadLocationImage";

export interface OpenLocationProps {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
  location: LocationDocumentWithGMProperties;
  closeLocation: () => void;
  isWorldOwnerPremium?: boolean;
  isSinglePlayer?: boolean;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    worldOwnerId,
    worldId,
    locationId,
    location,
    closeLocation,
    isWorldOwnerPremium,
    isSinglePlayer,
  } = props;

  const confirm = useConfirm();

  const { user } = useAuth();
  const uid = user?.uid;

  const isWorldOwner = worldOwnerId === uid;

  const { updateLocation, loading } = useUpdateLocation();
  const { updateLocationGMProperties } = useUpdateLocationGMProperties();
  const { updateLocationGMNotes } = useUpdateLocationGMNotes();
  const { deleteLocation } = useDeleteLocation();
  const { updateLocationNotes } = useUpdateLocationNotes();
  const { uploadLocationImage } = useUploadLocationImage();

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
        deleteLocation({ worldId, locationId })
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
      {isWorldOwnerPremium && (
        <ImageUploader
          title={location.name}
          src={location.imageUrls?.[0]}
          handleFileUpload={(image) =>
            uploadLocationImage({ worldId, locationId, image }).catch(() => {})
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
            updateLocation({
              worldId,
              locationId,
              location: { name: newName },
            }).catch(() => {})
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
                    updateLocationGMProperties({
                      worldId,
                      locationId,
                      locationGMProperties: { descriptor },
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
                    updateLocationGMProperties({
                      worldId,
                      locationId,
                      locationGMProperties: { trouble },
                    });
                  }}
                  oracleTableId={"ironsworn/oracles/settlement/trouble"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DebouncedOracleInput
                  label={"Location Features"}
                  initialValue={location?.gmProperties?.locationFeatures ?? ""}
                  updateValue={(locationFeatures) => {
                    updateLocationGMProperties({
                      worldId,
                      locationId,
                      locationGMProperties: { locationFeatures },
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
                          updateLocation({
                            worldId,
                            locationId,
                            location: { sharedWithPlayers: value },
                          }).catch(() => {})
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RichTextEditorNoTitle
                  content={location.gmProperties?.notes ?? ""}
                  onSave={({ content, isBeaconRequest }) =>
                    updateLocationGMNotes({
                      worldId,
                      locationId,
                      notes: content,
                      isBeacon: isBeaconRequest,
                    })
                  }
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
                    documentId={`iron-fellowship-${worldOwnerId}-${locationId}`}
                    documentPassword={worldId}
                    onSave={(notes, isBeaconRequest) =>
                      updateLocationNotes({
                        worldId,
                        locationId,
                        notes,
                        isBeacon: isBeaconRequest,
                      })
                    }
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
