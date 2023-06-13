import {
  Alert,
  Box,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUpdateLocation } from "api/worlds/locations/updateLocation";
import { useDeleteLocation } from "api/worlds/locations/deleteLocation";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/SectionHeading";
import { RichTextEditorNoTitle } from "components/RichTextEditor";
import { LocationNameInput } from "./LocationNameInput";
import { useRoller } from "providers/DieRollProvider";
import { useAuth } from "providers/AuthProvider";
import { useUpdateLocationGMProperties } from "api/worlds/locations/updateLocationGMProperties";
import { useUpdateLocationGMNotes } from "api/worlds/locations/updateLocationGMNotes";
import { DebouncedOracleInput } from "../DebouncedOracleInput";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { useUpdateLocationNotes } from "api/worlds/locations/updateLocationNotes";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";

export interface OpenLocationProps {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
  location: LocationDocumentWithGMProperties;
  closeLocation: () => void;
  isSinglePlayer?: boolean;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    worldOwnerId,
    worldId,
    locationId,
    location,
    closeLocation,
    isSinglePlayer,
  } = props;

  const confirm = useConfirm();
  const { rollOracleTable } = useRoller();

  const { user } = useAuth();
  const uid = user?.uid;

  const isWorldOwner = worldOwnerId === uid;

  const { updateLocation, loading } = useUpdateLocation();
  const { updateLocationGMProperties } = useUpdateLocationGMProperties();
  const { updateLocationGMNotes } = useUpdateLocationGMNotes();
  const { deleteLocation } = useDeleteLocation();
  const { updateLocationNotes } = useUpdateLocationNotes();

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
    <Box overflow={"auto"}>
      <Card
        sx={{
          maxWidth: 700,
        }}
      >
        <Box
          sx={{
            aspectRatio: "16/9",
            maxWidth: "100%",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            backgroundImage: 'url("/assets/test/PlagueVillage.png")',
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
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
                    initialValue={
                      location?.gmProperties?.locationFeatures ?? ""
                    }
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
                        label={
                          location.sharedWithPlayers
                            ? "Public Notes (Shared with players)"
                            : "Public Notes (Once shared with players)"
                        }
                        breakContainer
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity={"info"}>
                        Notes in this section will only be visible to characters
                        in campaigns. Singleplayer notes should go in the above
                        section.
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
      </Card>
    </Box>
  );
}
