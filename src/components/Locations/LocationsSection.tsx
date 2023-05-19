import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Hidden,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { EmptyState } from "components/EmptyState/EmptyState";
import { useCreateLocation } from "api/worlds/locations/createLocation";
import { OpenLocation } from "./OpenLocation";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";
import { useFilterLocations } from "./useFilterLocations";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "providers/AuthProvider";

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
    isCharacterSheet,
    isSinglePlayer,
    locations,
    openLocationId,
    setOpenLocationId,
    emphasizeButton,
    showHiddenTag,
  } = props;

  const isWorldOwner = useAuth().user?.uid === worldOwnerId;

  const { createLocation, loading: createLocationLoading } =
    useCreateLocation();

  const { search, setSearch, filteredLocations } =
    useFilterLocations(locations);

  if (!worldId || !worldOwnerId) {
    return (
      <EmptyState
        imageSrc="/assets/nature.svg"
        title={"No World Found"}
        message={
          isSinglePlayer
            ? 'Add a world in the "World" tab to allow you to add and view locations.'
            : "No world found. Your GM can add a world to the campaign in the GM Screen."
        }
      />
    );
  }

  const sortedLocations = Object.keys(filteredLocations).sort(
    (l1, l2) =>
      filteredLocations[l2].updatedDate.getTime() -
      filteredLocations[l1].updatedDate.getTime()
  );
  const openLocation = openLocationId && locations[openLocationId];

  if (openLocationId && openLocation) {
    return (
      <Box display={"flex"} alignItems={"stretch"}>
        <Hidden smDown>
          <Box>Sidebar</Box>
        </Hidden>
        <OpenLocation
          worldId={worldId}
          worldOwnerId={worldOwnerId}
          location={openLocation}
          locationId={openLocationId}
          closeLocation={() => setOpenLocationId(undefined)}
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
          py: 0.5,
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
              <CardActionArea
                onClick={() => setOpenLocationId(locationId)}
                sx={{ p: 2 }}
              >
                <Typography>{filteredLocations[locationId].name}</Typography>
                {showHiddenTag && (
                  <Typography variant={"caption"} color={"textSecondary"}>
                    {filteredLocations[locationId].sharedWithPlayers
                      ? "Visible"
                      : "Hidden"}
                  </Typography>
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
