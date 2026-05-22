import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { MapBackgroundImageFit, MapStrokeColors } from "types/Locations.type";
import OverflowMenuIcon from "@mui/icons-material/MoreHoriz";
import { useStore } from "stores/store";
import { useSnackbar } from "providers/SnackbarProvider";
import { useConfirm } from "material-ui-confirm";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";
import { toPng } from "html-to-image";

const MAP_EXPORT_SCALE = 4;

export interface MapOverflowOptionsMenuProps {
  locationId: string;
  hasBackgroundImage: boolean;
  mapStrokeColor: MapStrokeColors;
  mapBackgroundImageFit: MapBackgroundImageFit;
  mapContainerRef: RefObject<HTMLDivElement>;
  locationName?: string;
}

export function MapOverflowOptionsMenu(props: MapOverflowOptionsMenuProps) {
  const {
    locationId,
    hasBackgroundImage,
    mapStrokeColor,
    mapBackgroundImageFit,
    mapContainerRef,
    locationName,
  } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuParentRef = useRef<HTMLButtonElement>(null);
  const mapInputRef = useRef<HTMLInputElement>(null);

  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
  );
  const uploadBackgroundImage = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations
        .uploadLocationMapBackground
  );
  const removeBackgroundImage = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations
        .removeLocationMapBackground
  );

  const { error } = useSnackbar();
  const confirm = useConfirm();

  const getExportFileName = () =>
    locationName?.trim() ? locationName.trim() : `location-map-${locationId}`;

  const handleMapExport = async () => {
    setIsMenuOpen(false);

    if (!mapContainerRef.current) {
      error("Could not export this map right now.");
      return;
    }

    try {
      const backgroundColor = findBackgroundColor(mapContainerRef.current);
      const dataUrl = await toPng(mapContainerRef.current, {
        pixelRatio: MAP_EXPORT_SCALE,
        backgroundColor,
      });
      const link = document.createElement("a");
      link.download = `${getExportFileName()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (exportError) {
      console.error("Failed to export location map.", exportError);
      error("Failed to download map. Check the console for the export error.");
    }
  };

  const handleFileUpload = (file: File) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        error(
          `File is too large. The max file size is ${MAX_FILE_SIZE_LABEL}.`
        );
        return;
      }
      uploadBackgroundImage(locationId, file).catch(() => {});
    }
  };

  const handleFileRemove = () => {
    confirm({
      description: "Are you sure you want to remove the map background?",
      confirmationText: "Remove",
      confirmationButtonProps: {
        color: "error",
      },
    }).then(() => {
      removeBackgroundImage(locationId).catch(() => {});
    });
  };

  return (
    <>
      <IconButton
        color={"inherit"}
        ref={menuParentRef}
        onClick={() => setIsMenuOpen(true)}
      >
        <OverflowMenuIcon />
      </IconButton>
      <Menu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        anchorEl={menuParentRef.current}
      >
        <MenuItem
          onClick={() => {
            handleMapExport().catch(() => {});
          }}
        >
          Download Map
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
            mapInputRef.current?.click();
          }}
        >
          {hasBackgroundImage ? "Replace" : "Upload"} Background Image
        </MenuItem>
        {hasBackgroundImage && (
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false);
              handleFileRemove();
            }}
          >
            Remove Background Image
          </MenuItem>
        )}
        {hasBackgroundImage && (
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false);
              updateLocation(locationId, {
                mapStrokeColor:
                  mapStrokeColor === MapStrokeColors.Dark
                    ? MapStrokeColors.Light
                    : MapStrokeColors.Dark,
              }).catch(() => {});
            }}
          >
            Use {mapStrokeColor === MapStrokeColors.Dark ? "Light" : "Dark"}{" "}
            Line Colors
          </MenuItem>
        )}
        {hasBackgroundImage && (
          <MenuItem
            onClick={() => {
              setIsMenuOpen(false);
              updateLocation(locationId, {
                mapBackgroundImageFit:
                  mapBackgroundImageFit === MapBackgroundImageFit.Contain
                    ? MapBackgroundImageFit.Cover
                    : MapBackgroundImageFit.Contain,
              }).catch(() => {});
            }}
          >
            {mapBackgroundImageFit === MapBackgroundImageFit.Contain
              ? "Crop image to default grid size"
              : "Resize grid to fit image"}
          </MenuItem>
        )}
      </Menu>
      <input
        ref={mapInputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={(evt) => {
          const file = evt.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
      />
    </>
  );
}

function findBackgroundColor(element: HTMLElement) {
  let current: HTMLElement | null = element;

  while (current) {
    const backgroundColor = window.getComputedStyle(current).backgroundColor;
    if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)") {
      return backgroundColor;
    }

    current = current.parentElement;
  }

  return "rgb(0, 0, 0)";
}
