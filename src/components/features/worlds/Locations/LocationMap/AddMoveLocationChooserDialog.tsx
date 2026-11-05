import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";
import { useState } from "react";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { LocationCard } from "../LocationCard";
import SearchIcon from "@mui/icons-material/Search";

export interface AddMoveLocationChooserDialogProps {
  open: boolean;
  onClose: () => void;
  locations: Record<string, LocationWithGMProperties>;
  currentLocationId: string;
  onLocationSelected: (locationId: string) => void;
}

export function AddMoveLocationChooserDialog(
  props: AddMoveLocationChooserDialogProps
) {
  const { open, onClose, locations, currentLocationId, onLocationSelected } =
    props;

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredLocationIds = Object.keys(locations).filter((locationId) => {
    const location = locations[locationId];
    return (
      (showAll ? true : location?.parentLocationId === currentLocationId) &&
      location.name.toLowerCase().includes(search.toLowerCase()) &&
      locationId !== currentLocationId
    );
  });

  const sortedLocationIds = filteredLocationIds.sort((a, b) => {
    const locationA = locations[a];
    const locationB = locations[b];
    return locationA.name.localeCompare(locationB.name);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth>
      <DialogTitleWithCloseButton onClose={onClose}>
        Chose a Location to Add or Move
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position={"start"}>
                  <SearchIcon
                    sx={(theme) => ({ color: theme.palette.grey[300] })}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{ "aria-label": "Search Locations" }}
            placeholder={"Search"}
            value={search}
            onChange={(evt) => setSearch(evt.currentTarget.value)}
            sx={{
              mr: 1,
              minWidth: 250,
            }}
            size={"small"}
          />
          <FormControlLabel
            label={"Show all locations"}
            control={
              <Switch
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
              />
            }
          />
        </Box>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {sortedLocationIds.map((locationId) => {
            const location = locations[locationId];
            return (
              <Grid item xs={12} sm={6} key={locationId}>
                <LocationCard
                  location={location}
                  onClick={() => onLocationSelected(locationId)}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
