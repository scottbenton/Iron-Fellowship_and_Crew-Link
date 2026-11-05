import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ToggleButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import ExpandMore from "@mui/icons-material/ChevronRight";

export interface LocationsSidebarItemProps {
  locationId: string;
  locationParentMap: Record<string, string[]>;
  locations: Record<string, LocationWithGMProperties>;
  openLocationId: string;
  setOpenLocationId: (locationId: string) => void;
  showHiddenText: boolean;
  currentLocationAncestors: string[];
}

export function LocationsSidebarItem(props: LocationsSidebarItemProps) {
  const {
    locationId,
    locationParentMap,
    locations,
    openLocationId,
    setOpenLocationId,
    showHiddenText,
    currentLocationAncestors,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentLocationAncestors.includes(locationId)) {
      setIsExpanded(true);
    }
  }, [locationId, currentLocationAncestors]);

  const children = locationParentMap[locationId] || [];

  return (
    <>
      <ListItem
        disablePadding
        sx={{ alignItems: "stretch", position: "relative" }}
      >
        {children.length > 0 && (
          <ToggleButton
            value={locationId}
            selected={isExpanded}
            onChange={() => setIsExpanded(!isExpanded)}
            aria-label={`Show Locations in ${locations[locationId].name}`}
            sx={(theme) => ({
              position: "absolute",
              left: 4,
              top: 0,
              bottom: 0,
              margin: "auto 0",
              height: 24,
              zIndex: 1,
              borderWidth: 0,
              color: theme.palette.action.active + "!important",
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&.Mui-selected": {
                backgroundColor: "transparent!important",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover + "!important",
                },
              },
            })}
          >
            <ExpandMore
              sx={(theme) => ({
                transform: `rotate(${isExpanded ? "90deg" : "0deg"})`,
                transition: theme.transitions.create(["transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
              })}
            />
          </ToggleButton>
        )}
        <ListItemButton
          onClick={() => setOpenLocationId(locationId)}
          selected={locationId === openLocationId}
          sx={{ pl: "32px" }}
        >
          <ListItemText
            primary={locations[locationId].name}
            secondary={
              showHiddenText &&
              (!locations[locationId].sharedWithPlayers ? "Hidden" : "Shared")
            }
          />
        </ListItemButton>
      </ListItem>

      {isExpanded && children.length > 0 && (
        <List
          sx={(theme) => ({
            ml: 1,
            borderLeft: `1px solid ${theme.palette.divider}`,
          })}
        >
          {children.map((childId) => (
            <LocationsSidebarItem
              key={childId}
              locationId={childId}
              locationParentMap={locationParentMap}
              locations={locations}
              openLocationId={openLocationId}
              setOpenLocationId={setOpenLocationId}
              showHiddenText={showHiddenText}
              currentLocationAncestors={currentLocationAncestors}
            />
          ))}
        </List>
      )}
    </>
  );
}
