import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Hidden,
  Input,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { EmptyState } from "components/EmptyState/EmptyState";
import { useCreateLocation } from "api/worlds/locations/createLocation";
import { OpenLocation } from "./OpenLocation";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";
import { useFilterLocations } from "./useFilterLocations";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "providers/AuthProvider";
import { useUserDoc } from "api/user/getUserDoc";
import AddPhotoIcon from "@mui/icons-material/Photo";
import { WorldEmptyState } from "components/WorldEmptyState";

export interface LocationsSectionProps {
  worldOwnerId?: string;
  worldId?: string;
  isCharacterSheet?: boolean;
  isSinglePlayer?: boolean;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openLocationId?: string;
  setOpenLocationId: (locationId?: string) => void;
  emphasizeButton?: boolean;
  showHiddenTag?: boolean;
}

export function LocationsSection(props: LocationsSectionProps) {
  const {
    worldOwnerId,
    worldId,
    isSinglePlayer,
    locations,
    openLocationId,
    setOpenLocationId,
    emphasizeButton,
    showHiddenTag,
  } = props;

  const isWorldOwner = useAuth().user?.uid === worldOwnerId;
  const isWorldOwnerPremium =
    useUserDoc(worldOwnerId).user?.canUploadPhotos ?? false;

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
          isWorldOwnerPremium={isWorldOwnerPremium}
          isSinglePlayer={isSinglePlayer}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: theme.palette.divider,
          borderStyle: "solid",
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <Input
          fullWidth
          startAdornment={
            <InputAdornment position={"start"}>
              <SearchIcon
                sx={(theme) => ({ color: theme.palette.grey[300] })}
              />
            </InputAdornment>
          }
          aria-label={"Filter Locations"}
          placeholder={"Filter Locations"}
          value={search}
          onChange={(evt) => setSearch(evt.currentTarget.value)}
          color={"secondary"}
          sx={(theme) => ({
            mr: 2,
            flexGrow: 1,
          })}
        />
        <Button
          variant={emphasizeButton ? "contained" : "text"}
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
      </Box>
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
                {isWorldOwnerPremium && (
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
                <Box p={2}>
                  <Typography>{filteredLocations[locationId].name}</Typography>
                  {showHiddenTag && (
                    <Typography variant={"caption"} color={"textSecondary"}>
                      {filteredLocations[locationId].sharedWithPlayers
                        ? "Visible"
                        : "Hidden"}
                    </Typography>
                  )}
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
