import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import {
  LocationTab,
  LocationWithGMProperties,
} from "stores/world/currentWorld/locations/locations.slice.type";
import { useStore } from "stores/store";
import { useListenToCurrentLocation } from "stores/world/currentWorld/locations/useListenToCurrentLocation";
import { BondsSection } from "components/features/worlds/BondsSection";
import { LocationNPCs } from "./LocationNPCs";
import { useWorldPermissions } from "../useWorldPermissions";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";
import { useSnackbar } from "providers/SnackbarProvider";
import { GuideAndPlayerHeader, GuideOnlyHeader } from "../common";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import {
  FieldConfig,
  ILocationConfig,
  NameConfig,
  locationConfigs,
} from "config/locations.config";
import { LocationField } from "./LocationField";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { PageWithImage } from "../common/PageWithImage";
import { IconColors } from "types/Icon.type";
import { mergeIcons } from "components/shared/GameIcons/mergeIcons";
import MapIcon from "@mui/icons-material/Map";
import { LocationMap } from "./LocationMap";
import { SubLocations } from "./SubLocations";
import { useNewMaps } from "hooks/featureFlags/useNewMaps";
import MoveLocationIcon from "@mui/icons-material/ModeOfTravel";
import { useState } from "react";
import { MoveLocationDialog } from "./MoveLocationDialog";
import { LocationBreadcrumbs } from "./LocationBreadcrumbs";

export interface OpenLocationProps {
  worldId: string;
  locationId: string;
  location: LocationWithGMProperties;
  closeLocation: () => void;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
  hideBorder?: boolean;
}

export function OpenLocation(props: OpenLocationProps) {
  const {
    worldId,
    locationId,
    location,
    closeLocation,
    showHiddenTag,
    openNPCTab,
    hideBorder,
  } = props;
  const { showGMFields, showGMTips, isGuidedGame } = useWorldPermissions();

  // Todo - replace with world type from datasworn once released
  const settingId = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironlands",
    [GAME_SYSTEMS.STARFORGED]: "forge",
  });
  let settingConfig: ILocationConfig = {
    defaultIcon: {
      key: "GiCompass",
      color: IconColors.White,
    },
    ...locationConfigs[settingId],
  };
  if (location.type && settingConfig.locationTypeOverrides?.[location.type]) {
    settingConfig = {
      ...settingConfig,
      ...settingConfig?.locationTypeOverrides[location.type]?.config,
    };
  }
  useListenToCurrentLocation(locationId);

  const { error } = useSnackbar();
  const confirm = useConfirm();

  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
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

  const currentTab = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.openTab
  );
  const setCurrentTab = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.setLocationTab
  );

  let nameConfig: NameConfig | undefined = undefined;
  if (typeof settingConfig.name === "function") {
    nameConfig = settingConfig.name(locationId, location);
  } else {
    nameConfig = settingConfig.name;
  }
  const sharedFieldConfig: FieldConfig[] = settingConfig.sharedFields ?? [];
  const gmFieldConfig: FieldConfig[] = settingConfig.gmFields ?? [];

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

  const onFileUpload = (file: File) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        return;
      }
      uploadLocationImage(locationId, file).catch(() => {});
    }
  };

  const icon = mergeIcons(
    {
      key: "GiCompass",
      color: IconColors.White,
    },
    settingConfig.defaultIcon,
    location.icon
  );

  const showNewMaps = useNewMaps();

  const [moveLocationDialogOpen, setMoveLocationDialogOpen] = useState(false);

  return (
    <PageWithImage
      hideBorder={hideBorder}
      breadcrumbs={<LocationBreadcrumbs locationId={locationId} />}
      imageUrl={location.imageUrl}
      icon={icon}
      actions={
        <>
          {showGMFields && (
            <>
              {showNewMaps && (
                <>
                  <Tooltip title={"Move Location"}>
                    <IconButton onClick={() => setMoveLocationDialogOpen(true)}>
                      <MoveLocationIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Toggle Map ${location.showMap ? "Off" : "On"}`}
                  >
                    <IconButton
                      onClick={() => {
                        updateLocation(locationId, {
                          showMap: !location.showMap,
                        }).catch(() => {});
                      }}
                      sx={{
                        bgcolor: location.showMap ? "darkGrey.main" : undefined,
                        color: location.showMap
                          ? "darkGrey.contrastText"
                          : undefined,
                        "&:hover": {
                          bgcolor: location.showMap
                            ? "darkGrey.dark"
                            : undefined,
                        },
                      }}
                    >
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Tooltip title={"Delete"}>
                <IconButton onClick={() => handleLocationDelete()}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </>
      }
      name={location.name}
      nameInput={
        <DebouncedOracleInput
          label={"Name"}
          variant={"outlined"}
          color={"primary"}
          oracleTableId={nameConfig?.oracleIds}
          joinOracleTables={nameConfig?.joinOracles}
          initialValue={location.name}
          updateValue={(newName) =>
            updateLocation(locationId, { name: newName }).catch(() => {})
          }
          fullWidth={true}
          sx={{
            mt: 1,
          }}
        />
      }
      handleImageUpload={onFileUpload}
      handleIconSelection={(icon) => {
        if (location.imageUrl) {
          removeLocationImage(locationId).catch(() => {});
        }
        updateLocation(locationId, { icon }).catch(() => {});
      }}
      handleImageRemove={() => removeLocationImage(locationId)}
      handlePageClose={closeLocation}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <Box mt={1}>
          {location.showMap && showNewMaps && (
            <Box sx={{ mx: { xs: -2, sm: -3 } }}>
              <LocationMap
                locationId={locationId}
                map={location.map}
                backgroundImageUrl={location.mapBackgroundImageUrl}
              />
            </Box>
          )}

          <Box sx={{ mx: { xs: -2, sm: -3 } }}>
            <Tabs
              centered
              variant={"standard"}
              indicatorColor="primary"
              value={currentTab}
              onChange={(_, tab) => setCurrentTab(tab)}
            >
              <Tab value={LocationTab.Notes} label={"Notes"} />
              <Tab value={LocationTab.NPCs} label={"NPCs"} />
              {showNewMaps && (
                <Tab value={LocationTab.SubLocations} label={"Sub-Locations"} />
              )}
            </Tabs>
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {currentTab === LocationTab.Notes && (
              <>
                <Grid item xs={12} />
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    freeSolo
                    autoSelect
                    options={Object.values(
                      settingConfig.locationTypeOverrides ?? {}
                    ).map((config) => config.label)}
                    value={getLabelFromTypeKey(settingConfig, location.type)}
                    onChange={(evt, value) => {
                      updateLocation(locationId, {
                        type: getTypeKeyFromLabel(settingConfig, value),
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Location Type"}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                {sharedFieldConfig.map((field, index) => (
                  <LocationField
                    key={index}
                    locationId={locationId}
                    location={location}
                    field={field}
                    isGMField={false}
                  />
                ))}

                {showGMFields && (
                  <>
                    {showGMTips && (
                      <>
                        <Grid item xs={12}>
                          <GuideOnlyHeader breakContainer />
                        </Grid>
                      </>
                    )}
                    {gmFieldConfig.map((field, index) => (
                      <LocationField
                        key={index}
                        locationId={locationId}
                        location={location}
                        field={field}
                        isGMField
                      />
                    ))}
                    {isGuidedGame && showGMFields && (
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
                    {!isGuidedGame && settingConfig.showBasicBond && (
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
                {isGuidedGame && (
                  <>
                    {showGMTips && (
                      <Grid item xs={12}>
                        <GuideAndPlayerHeader breakContainer />
                      </Grid>
                    )}
                    {settingConfig.showBasicBond && (
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
                      />
                    )}
                    {!location.sharedWithPlayers && (
                      <Grid item xs={12}>
                        <Alert severity="warning">
                          These notes are not yet visible to players because
                          this location is hidden from them.
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
              </>
            )}
            {currentTab === LocationTab.NPCs && (
              <LocationNPCs
                locationId={locationId}
                showHiddenTag={showHiddenTag}
                openNPCTab={openNPCTab}
              />
            )}
            {currentTab === LocationTab.SubLocations && (
              <SubLocations locationId={locationId} />
            )}
          </Grid>
        </Box>
      </Box>
      <MoveLocationDialog
        open={moveLocationDialogOpen}
        onClose={() => setMoveLocationDialogOpen(false)}
        locationId={locationId}
        location={location}
      />
    </PageWithImage>
  );
}

const getTypeKeyFromLabel = (
  config: ILocationConfig | undefined,
  label: string | undefined | null
): string => {
  const overrides = config?.locationTypeOverrides;
  if (!overrides || !label) {
    return label ?? "";
  }
  const matchingOption = Object.keys(overrides).find(
    (optionKey) => overrides[optionKey].label === label
  );
  return matchingOption ?? label;
};

const getLabelFromTypeKey = (
  config: ILocationConfig | undefined,
  key: string | null | undefined
): string => {
  const overrides = config?.locationTypeOverrides;
  if (!overrides || !key) {
    return key ?? "";
  }

  return overrides[key]?.label ?? key;
};
