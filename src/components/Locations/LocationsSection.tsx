import { Button, Card, CardActionArea, Grid } from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { EmptyState } from "components/EmptyState/EmptyState";
import { AddLocationDialog } from "./AddLocationDialog";
import { useState } from "react";
import { useCreateLocation } from "api/worlds/locations/createLocation";
import { OpenLocation } from "./OpenLocation";
import { LocationDocumentWithGMProperties } from "stores/sharedLocationStore";

export interface LocationsSectionProps {
  worldOwnerId?: string;
  worldId?: string;
  isCharacterSheet?: boolean;
  isSinglePlayer?: boolean;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openLocationId?: string;
  setOpenLocationId: (locationId?: string) => void;
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
  } = props;

  const { createLocation, loading: createLocationLoading } =
    useCreateLocation();

  const [addLocationDialogOpen, setAddLocationDialogOpen] =
    useState<boolean>(false);

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

  const sortedLocations = Object.keys(locations).sort(
    (l1, l2) =>
      locations[l2].updatedDate.getUTCMilliseconds() -
      locations[l1].updatedDate.getUTCMilliseconds()
  );
  const openLocation = openLocationId && locations[openLocationId];

  if (openLocationId && openLocation) {
    return (
      <OpenLocation
        worldId={worldId}
        worldOwnerId={worldOwnerId}
        location={openLocation}
        locationId={openLocationId}
        closeLocation={() => setOpenLocationId(undefined)}
        isSinglePlayer={isSinglePlayer}
      />
    );
  }

  return (
    <>
      <SectionHeading
        label={"Locations"}
        action={
          <Button
            endIcon={<AddLocationIcon />}
            onClick={() =>
              createLocation(worldOwnerId, worldId)
                .catch(() => {})
                .then((locationId) => {
                  if (locationId) {
                    setOpenLocationId(locationId);
                  }
                })
            }
            disabled={createLocationLoading}
          >
            Add Location
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ p: 2 }}>
        {sortedLocations.map((locationId) => (
          <Grid item xs={12} md={6} lg={4} key={locationId}>
            <Card variant={"outlined"}>
              <CardActionArea
                onClick={() => setOpenLocationId(locationId)}
                sx={{ p: 2 }}
              >
                {locations[locationId].name}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <AddLocationDialog
        open={addLocationDialogOpen}
        onClose={() => setAddLocationDialogOpen(false)}
      />
    </>
  );
}
