import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Hidden,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { OpenLocation } from "./OpenLocation";
import { useFilterLocations } from "./useFilterLocations";
import AddPhotoIcon from "@mui/icons-material/Photo";
import { WorldEmptyState } from "components/WorldEmptyState";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { FilterBar } from "components/FilterBar";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { useStore } from "stores/store";
import { useState } from "react";

export interface LocationsSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
  openNPCTab: () => void;
}

export function LocationsSection(props: LocationsSectionProps) {
  const { isSinglePlayer, showHiddenTag, openNPCTab } = props;

  const isWorldOwner = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorld?.ownerIds.includes(
        store.auth.uid
      ) ?? false
  );
  const worldId = useStore((store) => store.worlds.currentWorld.currentWorldId);
  const doAnyDocsHaveImages = useStore(
    (store) => store.worlds.currentWorld.doAnyDocsHaveImages
  );
  const locations = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );
  const openLocationId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.openLocationId
  );
  const setOpenLocationId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.setOpenLocationId
  );
  const search = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationSearch
  );
  const setSearch = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.setLocationSearch
  );

  const userCanUploadImages = useCanUploadWorldImages();
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

  const [createLocationLoading, setCreateLocationLoading] = useState(false);
  const createLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.createLocation
  );

  const handleCreateLocation = () => {
    setCreateLocationLoading(true);
    createLocation()
      .then((locationId) => {
        setOpenLocationId(locationId);
      })
      .catch(() => {})
      .finally(() => setCreateLocationLoading(false));
  };

  const { filteredLocationIds, sortedLocationIds } = useFilterLocations(
    locations,
    search
  );

  if (!worldId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  const openLocation = openLocationId && locations[openLocationId];

  if (openLocationId && openLocation) {
    return (
      <Box
        display={"flex"}
        alignItems={"stretch"}
        maxHeight={"100%"}
        height={"100%"}
      >
        <Hidden smDown>
          <Box overflow={"auto"} flexGrow={1} minWidth={200} maxWidth={400}>
            <List>
              {sortedLocationIds.map((locationId) => (
                <ListItem key={locationId} disablePadding>
                  <ListItemButton
                    onClick={() => setOpenLocationId(locationId)}
                    selected={locationId === openLocationId}
                  >
                    <ListItemText
                      primary={locations[locationId].name}
                      secondary={
                        !isSinglePlayer &&
                        isWorldOwner &&
                        (!locations[locationId].sharedWithPlayers
                          ? "Hidden"
                          : "Shared")
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Hidden>

        <OpenLocation
          worldId={worldId}
          isWorldOwner={isWorldOwner}
          location={openLocation}
          locationId={openLocationId}
          closeLocation={() => setOpenLocationId(undefined)}
          canShowImages={canShowImages}
          isSinglePlayer={isSinglePlayer}
          showHiddenTag={showHiddenTag}
          openNPCTab={openNPCTab}
        />
      </Box>
    );
  }

  return (
    <>
      <FilterBar
        search={search}
        setSearch={setSearch}
        action={
          <Button
            variant={"contained"}
            endIcon={<AddLocationIcon />}
            onClick={handleCreateLocation}
            disabled={createLocationLoading}
            sx={{ flexShrink: 0 }}
          >
            Add Location
          </Button>
        }
        searchPlaceholder={"Search by name"}
      />

      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
        }}
      >
        {filteredLocationIds.map((locationId) =>
          locations[locationId] ? (
            <Grid item xs={12} md={6} lg={4} key={locationId}>
              <Card variant={"outlined"}>
                <CardActionArea onClick={() => setOpenLocationId(locationId)}>
                  {canShowImages && (
                    <Box
                      sx={(theme) => ({
                        aspectRatio: "16/9",
                        maxWidth: "100%",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        backgroundImage: `url("${locations[locationId].imageUrl}")`,
                        backgroundColor:
                          theme.palette.mode === "light"
                            ? theme.palette.grey[300]
                            : theme.palette.grey[700],
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      })}
                    >
                      {!locations[locationId].imageUrl && (
                        <AddPhotoIcon
                          sx={(theme) => ({
                            width: 30,
                            height: 30,
                            color:
                              theme.palette.mode === "light"
                                ? theme.palette.grey[500]
                                : theme.palette.grey[300],
                          })}
                        />
                      )}
                    </Box>
                  )}
                  <Box
                    p={2}
                    flexGrow={1}
                    display={"flex"}
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Typography>{locations[locationId].name}</Typography>
                    </Box>

                    {!locations[locationId].sharedWithPlayers &&
                      showHiddenTag && <HiddenIcon color={"action"} />}
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ) : null
        )}
      </Grid>
    </>
  );
}
