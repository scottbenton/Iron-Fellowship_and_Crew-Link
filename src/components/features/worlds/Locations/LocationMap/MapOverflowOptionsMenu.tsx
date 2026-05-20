import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { MapBackgroundImageFit, MapStrokeColors } from "types/Locations.type";
import OverflowMenuIcon from "@mui/icons-material/MoreHoriz";
import { useStore } from "stores/store";
import { useSnackbar } from "providers/SnackbarProvider";
import { useConfirm } from "material-ui-confirm";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";

export interface MapOverflowOptionsMenuProps {
  locationId: string;
  hasBackgroundImage: boolean;
  mapStrokeColor: MapStrokeColors;
  mapBackgroundImageFit: MapBackgroundImageFit;
}

export function MapOverflowOptionsMenu(props: MapOverflowOptionsMenuProps) {
  const {
    locationId,
    hasBackgroundImage,
    mapStrokeColor,
    mapBackgroundImageFit,
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
        multiple
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
