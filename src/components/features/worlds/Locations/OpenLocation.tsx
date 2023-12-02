import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChangeEvent, useLayoutEffect, useRef } from "react";
import { useConfirm } from "material-ui-confirm";
import { SectionHeading } from "components/shared/SectionHeading";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { useStore } from "stores/store";
import { useListenToCurrentLocation } from "stores/world/currentWorld/locations/useListenToCurrentLocation";
import { BondsSection } from "components/features/worlds/BondsSection";
import { LocationNPCs } from "./LocationNPCs";
import { useWorldPermissions } from "../useWorldPermissions";
import { ItemHeader } from "../ItemHeader";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import { ImageBanner } from "../ImageBanner";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";
import { useSnackbar } from "providers/SnackbarProvider";

export interface OpenLocationProps {
  worldId: string;
  locationId: string;
  location: LocationDocumentWithGMProperties;
  closeLocation: () => void;
  canShowImages?: boolean;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    worldId,
    locationId,
    location,
    closeLocation,
    canShowImages,
    showHiddenTag,
    openNPCTab,
  } = props;

  const { isSinglePlayer, showGMFields, showGMTips } = useWorldPermissions();

  useListenToCurrentLocation(locationId);

  const { error } = useSnackbar();
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
  const removeLocationImage = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.removeLocationImage
  );

  const currentCharacterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const singleplayerBond =
    currentCharacterId && location.characterBonds
      ? location.characterBonds[currentCharacterId]
      : false;
  const updateLocationCharacterBond = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations
        .updateLocationCharacterBond
  );

  const currentCampaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );
  const bondedCharacterNames = Object.keys(currentCampaignCharacters)
    .filter((characterId) => location.characterBonds?.[characterId])
    .map((characterId) => currentCampaignCharacters[characterId]?.name ?? "");

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    const file = files?.[0];
    if (file) {
      if (files[0].size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        evt.target.value = "";
        return;
      }
      uploadLocationImage(locationId, file).catch(() => {});
    }
  };

  return (
    <Box
      overflow={"auto"}
      bgcolor={(theme) => theme.palette.background.paper}
      borderLeft={(theme) => `1px solid ${theme.palette.divider}`}
      width={"100%"}
    >
      <input
        type="file"
        accept={"image/*"}
        hidden
        ref={fileInputRef}
        onChange={onFileUpload}
      />
      {canShowImages && (
        <ImageBanner
          title={location.name}
          src={location.imageUrl}
          removeImage={() => removeLocationImage(locationId)}
        />
      )}
      <ItemHeader
        itemName={location.name}
        updateName={(newName) =>
          updateLocation(locationId, { name: newName }).catch(() => {})
        }
        nameOracleIds={[
          "ironsworn/oracles/settlement/name/landscape_feature",
          "ironsworn/oracles/settlement/name/manmade_edifice",
          "ironsworn/oracles/settlement/name/creature",
          "ironsworn/oracles/settlement/name/historical_event",
          "ironsworn/oracles/settlement/name/old_world_language",
          "ironsworn/oracles/settlement/name/environmental_aspect",
          [
            "ironsworn/oracles/settlement/quick_name/prefix",
            "ironsworn/oracles/settlement/quick_name/suffix",
          ],
        ]}
        actions={
          <>
            {canShowImages && (
              <Tooltip title={"Upload Image"}>
                <IconButton onClick={() => fileInputRef?.current?.click()}>
                  <AddPhotoIcon />
                </IconButton>
              </Tooltip>
            )}
            {showGMFields && (
              <Tooltip title={"Delete"}>
                <IconButton onClick={() => handleLocationDelete()}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
        closeItem={closeLocation}
      />
      <Box
        sx={(theme) => ({
          mt: 1,
          px: 3,
          [theme.breakpoints.down("sm")]: { px: 2 },
        })}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {showGMFields && (
            <>
              {showGMTips && (
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
              {!isSinglePlayer && showGMFields && (
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
              {isSinglePlayer && (
                <BondsSection
                  isStarforged={false}
                  hasConnection={false}
                  onBondToggle={
                    currentCharacterId
                      ? (bonded) =>
                          updateLocationCharacterBond(
                            locationId,
                            currentCharacterId,
                            bonded
                          ).catch(() => {})
                      : undefined
                  }
                  isBonded={singleplayerBond}
                  bondedCharacters={bondedCharacterNames}
                />
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
              {showGMTips && (
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
              <BondsSection
                isStarforged={false}
                hasConnection={false}
                onBondToggle={
                  currentCharacterId
                    ? (bonded) =>
                        updateLocationCharacterBond(
                          locationId,
                          currentCharacterId,
                          bonded
                        ).catch(() => {})
                    : undefined
                }
                isBonded={singleplayerBond}
                bondedCharacters={bondedCharacterNames}
              />
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
          <LocationNPCs
            locationId={locationId}
            canUseImages={canShowImages ?? false}
            showHiddenTag={showHiddenTag}
            openNPCTab={openNPCTab}
          />
        </Grid>
      </Box>
    </Box>
  );
}
