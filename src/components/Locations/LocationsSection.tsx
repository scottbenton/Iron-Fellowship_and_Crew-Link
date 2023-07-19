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
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";
import { useFilterLocations } from "./useFilterLocations";
import { useAuth } from "providers/AuthProvider";
import AddPhotoIcon from "@mui/icons-material/Photo";
import { WorldEmptyState } from "components/WorldEmptyState";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { FilterBar } from "components/FilterBar";
import { useCanUploadWorldImages } from "hooks/featureFlags/useCanUploadWorldImages";

export interface LocationsSectionProps {
  doAnyDocsHaveImages: boolean;
  worldOwnerId?: string;
  worldId?: string;
  isCharacterSheet?: boolean;
  isSinglePlayer?: boolean;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openLocationId?: string;
  setOpenLocationId: (locationId?: string) => void;
  showHiddenTag?: boolean;
}

export function LocationsSection(props: LocationsSectionProps) {
  const {
    doAnyDocsHaveImages,
    worldOwnerId,
    worldId,
    isSinglePlayer,
    locations,
    openLocationId,
    setOpenLocationId,
    showHiddenTag,
  } = props;

  const isWorldOwner = useAuth().user?.uid === worldOwnerId;

  const userCanUploadImages = useCanUploadWorldImages();
  const canShowImages = doAnyDocsHaveImages || userCanUploadImages;

  const { createLocation, loading: createLocationLoading } =
    useCreateLocation();

  const { search, setSearch, filteredLocations } =
    useFilterLocations(locations);

  if (!worldId || !worldOwnerId) {
    return (
      <WorldEmptyState isMultiplayer={!isSinglePlayer} isGM={isWorldOwner} />
    );
  }

  const sortedLocations = Object.keys(filteredLocations).sort(
    (l1, l2) =>
      filteredLocations[l2].createdDate.getTime() -
      filteredLocations[l1].createdDate.getTime()
  );
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
              {sortedLocations.map((locationId) => (
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
          worldOwnerId={worldOwnerId}
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
        {sortedLocations.map((locationId) => (
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
                      backgroundImage: `url("${filteredLocations[locationId].imageUrls?.[0]}")`,
                      backgroundColor: theme.palette.grey[300],
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    {!filteredLocations[locationId].imageUrls?.length && (
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
                    <Typography>
                      {filteredLocations[locationId].name}
                    </Typography>
                  </Box>

                  {!filteredLocations[locationId].sharedWithPlayers &&
                    showHiddenTag && <HiddenIcon color={"action"} />}
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
