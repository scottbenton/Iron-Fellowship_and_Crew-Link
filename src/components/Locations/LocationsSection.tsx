import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Hidden,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { useCreateLocation } from "api/worlds/locations/createLocation";
import { OpenLocation } from "./OpenLocation";
import { useFilterLocations } from "./useFilterLocations";
import AddPhotoIcon from "@mui/icons-material/Photo";
import { WorldEmptyState } from "components/WorldEmptyState";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { FilterBar } from "components/FilterBar";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";
import { useStore } from "stores/store";

export interface LocationsSectionProps {
  isSinglePlayer?: boolean;
  showHiddenTag?: boolean;
}

export function LocationsSection(props: LocationsSectionProps) {
  const { isSinglePlayer, showHiddenTag } = props;

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

  const { createLocation, loading: createLocationLoading } =
    useCreateLocation();

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
                <ListItemButton
                  key={locationId}
                  selected={locationId === openLocationId}
                  onClick={() => setOpenLocationId(locationId)}
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
            onClick={() =>
              createLocation(worldId)
                .catch(() => {})
                .then((locationId) => {
                  if (locationId) {
                    setOpenLocationId(locationId);
                  }
                })
            }
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
                        backgroundColor: theme.palette.grey[300],
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
                            color: theme.palette.grey[500],
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
