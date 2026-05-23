import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
} from "@mui/material";
import { LocationHexagon, LocationHexagonProps } from "./LocationHexagon";
import {
  LocationMap as ILocationMap,
  MapBackgroundImageFit,
  MapEntryBackgroundColors,
  MapEntryType,
  MapStrokeColors,
} from "types/Locations.type";
import { useStore } from "stores/store";
import { useState } from "react";
import { MapTool, MapTools, draggableMapTools } from "./MapTools.enum";
import { MapToolChooser } from "./MapToolChooser";
import { arrayUnion } from "firebase/firestore";
import { LocationItemAvatar } from "./LocationItemAvatar";
import { checkIsLocationCell, getValidLocations } from "./checkIsLocationCell";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { locationConfigs } from "config/locations.config";
import { useRoller } from "stores/appState/useRoller";
import { useImageDimensions } from "./useImageDimensions";
import { MapOverflowOptionsMenu } from "./MapOverflowOptionsMenu";
import {
  DEFAULT_MAP_HEX_SIZE,
  MAX_MAP_DIMENSIONS_PX,
  getColumnCountForRow,
  getMapLayout,
} from "./mapDimensions";

export interface LocationMapProps {
  locationId: string;
  backgroundImageUrl?: string;
  map?: ILocationMap;
}

const DEFAULT_LABEL_SIZE = (DEFAULT_MAP_HEX_SIZE * 3) / 4;
const LABEL_SCALE_EXPONENT = 0.75;

export function LocationMap(props: LocationMapProps) {
  const { locationId, map = {}, backgroundImageUrl } = props;
  const locationMap = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );
  const currentLocation = locationMap[locationId];

  const mapStrokeColor = backgroundImageUrl
    ? currentLocation?.mapStrokeColor ?? MapStrokeColors.Dark
    : MapStrokeColors.Light;
  const mapBackgroundFit =
    currentLocation?.mapBackgroundImageFit ?? MapBackgroundImageFit.Contain;

  const backgroundImageDimensions = useImageDimensions(
    backgroundImageUrl && mapBackgroundFit === MapBackgroundImageFit.Contain
      ? backgroundImageUrl
      : undefined
  );

  const hexSize = currentLocation?.mapHexSize ?? DEFAULT_MAP_HEX_SIZE;

  const { rows, cols, width, height, firstColOffset, firstRowOffset } =
    getMapLayout({
      hexSize,
      maxWidth: MAX_MAP_DIMENSIONS_PX,
      maxHeight: MAX_MAP_DIMENSIONS_PX,
      imageDimensions: backgroundImageDimensions,
      mapRows: currentLocation?.mapRows,
      mapCols: currentLocation?.mapCols,
    });

  const verticalSpacing: number = 1.5 * hexSize;
  const horizontalSpacing: number = hexSize * Math.sqrt(3);
  const offsetX: number = (hexSize * Math.sqrt(3)) / 2;
  const labelScaleRatio = Math.pow(
    hexSize / DEFAULT_MAP_HEX_SIZE,
    LABEL_SCALE_EXPONENT
  );
  const labelSize = DEFAULT_LABEL_SIZE * labelScaleRatio;
  const labelOutlineWidth = Math.max(1.5, labelSize / 9);

  const settingId = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironlands",
    [GAME_SYSTEMS.STARFORGED]: "forge",
  });
  const settingConfig = locationConfigs[settingId];

  const createLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.createSpecificLocation
  );
  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
  );
  const setOpenLocationId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.setOpenLocationId
  );
  const moveLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.moveLocation
  );

  const [mapTool, setMapTool] = useState<MapTool>();

  const [multiLocationChooserState, setMultiLocationChooserState] = useState<{
    open: boolean;
    locationIds: string[];
    parentCell?: SVGPolygonElement;
  }>({
    open: false,
    locationIds: [],
  });

  const { rollOracleTable } = useRoller();

  const [isDragging, setIsDragging] = useState(false);

  const handleHexClick = async (
    row: number,
    col: number,
    locationIds: string[] | undefined,
    cellRef: SVGPolygonElement
  ) => {
    // TODO - check if location still exists when overwriting. If it doesn't, we can overwrite it no problem
    if (mapTool?.type === MapTools.AddPath) {
      const currentCell = map[row]?.[col];
      if (
        !checkIsLocationCell(currentCell ?? undefined, locationId, locationMap)
      ) {
        updateLocation(locationId, {
          [`map.${row}.${col}.type`]:
            currentCell?.type === MapEntryType.Path ? null : MapEntryType.Path,
        }).catch(() => {});
      }
    } else if (mapTool?.type === MapTools.AddLocation) {
      const type = mapTool.locationType;
      const locationConfig = settingConfig?.locationTypeOverrides?.[type];
      const configCreateLocation =
        settingConfig?.locationTypeOverrides?.[type]?.config.createLocation;
      createLocation({
        name: `${locationConfig ? locationConfig.label : "New Location"}`,
        parentLocationId: locationId,
        sharedWithPlayers: true,
        type: type,
        updatedDate: new Date(),
        createdDate: new Date(),
        ...(configCreateLocation
          ? await configCreateLocation(rollOracleTable)
          : {}),
      })
        .then((id) => {
          updateLocation(locationId, {
            [`map.${row}.${col}.type`]: MapEntryType.Location,
            [`map.${row}.${col}.locationIds`]: arrayUnion(id),
          }).catch(() => {});
        })
        .catch(() => {});
      setMapTool(undefined);
    } else if (mapTool?.type === MapTools.MoveLocation) {
      const locationToMove = locationMap[mapTool.locationId];
      if (locationToMove) {
        moveLocation(
          mapTool.locationId,
          locationToMove,
          locationId,
          row,
          col
        ).catch(() => {});
        setMapTool(undefined);
      }
    } else if (mapTool?.type === MapTools.BackgroundPaint) {
      const color = mapTool.color;
      updateLocation(locationId, {
        [`map.${row}.${col}.background.color`]: color,
      }).catch(() => {});
    } else if (!mapTool && locationIds) {
      const filteredLocationIds = getValidLocations(
        locationId,
        locationMap,
        locationIds
      );
      if (filteredLocationIds.length === 1) {
        setOpenLocationId(filteredLocationIds[0]);
      } else if (filteredLocationIds.length > 1) {
        setMultiLocationChooserState({
          open: true,
          locationIds: filteredLocationIds,
          parentCell: cellRef,
        });
      }
    } else if (mapTool?.type === MapTools.BackgroundEraser) {
      updateLocation(locationId, {
        [`map.${row}.${col}.background`]: null,
      }).catch(() => {});
    }
  };

  const handleFillBackground = () => {
    if (mapTool?.type === MapTools.BackgroundPaint) {
      const color = mapTool.color;
      const updates: Record<string, MapEntryBackgroundColors> = {};
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < getColumnCountForRow(cols, row); col++) {
          updates[`map.${row}.${col}.background.color`] = color;
        }
      }
      updateLocation(locationId, updates).catch(() => {});
      setMapTool(undefined);
    } else if (mapTool?.type === MapTools.BackgroundEraser) {
      const updates: Record<string, null> = {};
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < getColumnCountForRow(cols, row); col++) {
          updates[`map.${row}.${col}.background`] = null;
        }
      }
      updateLocation(locationId, updates).catch(() => {});
      setMapTool(undefined);
    }
  };

  return (
    <Box
      width={"100%"}
      overflow={"hidden"}
      sx={{
        bgcolor: "background.mapBackground",
        color: "#fff",
        overflowX: "auto",
      }}
    >
      <Box
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: width,
          color: "#fff",
          "&>svg": {
            display: "flex",
            marginX: "auto",
          },

          "& .hexagon": {
            cursor: "pointer",
            fill: theme.palette.grey[900],
            fillOpacity: "0%",
            color: theme.palette.grey[600],
            "&:hover": {
              fill: theme.palette.grey[200],
              fillOpacity: "20%",
            },
          },
          "& .path-line": {
            background: "none",
            pointerEvents: "none",
            height: 0,
            overflow: "visible",
          },
        })}
      >
        <Box
          mb={1}
          color={"grey.300"}
          mx={"auto"}
          minWidth={width}
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
        >
          <Box>
            {(mapTool?.type === MapTools.BackgroundPaint ||
              mapTool?.type === MapTools.BackgroundEraser) && (
              <Button
                color={"inherit"}
                size={"small"}
                variant={"outlined"}
                sx={{ ml: 1 }}
                onClick={() => handleFillBackground()}
              >
                {mapTool?.type === MapTools.BackgroundPaint
                  ? "Fill Background"
                  : "Clear Background"}
              </Button>
            )}
          </Box>
          <MapOverflowOptionsMenu
            locationId={locationId}
            hasBackgroundImage={!!backgroundImageUrl}
            mapStrokeColor={mapStrokeColor}
            mapBackgroundImageFit={mapBackgroundFit}
          />
        </Box>

        <svg
          width={width}
          height={height}
          style={{ minWidth: width, minHeight: height, overflow: "visible" }}
        >
          {backgroundImageUrl && (
            <image
              width={width}
              height={height}
              href={backgroundImageUrl}
              preserveAspectRatio={
                mapBackgroundFit === MapBackgroundImageFit.Contain
                  ? "xMidYMid slice"
                  : "xMidYMid slice"
              }
              style={{
                background: "none",
                pointerEvents: "none",
              }}
              x={0}
              y={0}
            ></image>
          )}
          {new Array(rows).fill(0).map((_, row) => {
            return new Array(getColumnCountForRow(cols, row))
              .fill(0)
              .map((_, col) => {
                const x: number =
                  col * horizontalSpacing +
                  (row % 2 === 1 ? offsetX : 0) +
                  hexSize +
                  firstColOffset;
                const y: number =
                  row * verticalSpacing + hexSize + firstRowOffset;

                const mapEntry = map[row]?.[col];

                let pathConnections: LocationHexagonProps["pathConnections"] =
                  undefined;

                if (mapEntry?.type === MapEntryType.Path) {
                  pathConnections = getConnections(
                    map,
                    row,
                    col,
                    locationId,
                    locationMap
                  );
                }

                const locationIds =
                  mapEntry?.type === MapEntryType.Location
                    ? mapEntry.locationIds
                    : [];

                return (
                  <LocationHexagon
                    locationId={locationId}
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    size={hexSize}
                    locationMap={locationMap}
                    mapEntry={mapEntry ?? undefined}
                    pathConnections={pathConnections}
                    onClick={(cell) => {
                      if (
                        !mapTool ||
                        (mapTool && !draggableMapTools.includes(mapTool.type))
                      ) {
                        handleHexClick(row, col, locationIds, cell);
                      }
                    }}
                    hasBackgroundImage={!!backgroundImageUrl}
                    mapStrokeColor={mapStrokeColor}
                    onMouseDown={(cell) => {
                      if (mapTool && draggableMapTools.includes(mapTool.type)) {
                        handleHexClick(row, col, locationIds, cell);
                      }
                      setIsDragging(true);
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseEnter={(cell) => {
                      if (
                        isDragging &&
                        mapTool &&
                        draggableMapTools.includes(mapTool.type)
                      ) {
                        handleHexClick(row, col, locationIds, cell);
                      }
                    }}
                  />
                );
              });
          })}
          {new Array(rows).fill(0).map((r, row) => {
            return new Array(getColumnCountForRow(cols, row))
              .fill(0)
              .map((c, col) => {
                const x: number =
                  col * horizontalSpacing +
                  (row % 2 === 1 ? offsetX : 0) +
                  hexSize +
                  firstColOffset;
                const y: number =
                  row * verticalSpacing + hexSize + firstRowOffset;

                let locationIds: string[] = [];
                const hex = map[row]?.[col];
                if (hex?.type === MapEntryType.Location) {
                  locationIds = getValidLocations(
                    locationId,
                    locationMap,
                    hex.locationIds
                  );
                }

                let name: string | undefined = undefined;

                if (locationIds.length === 1) {
                  name = locationMap[locationIds[0]]?.name;
                } else if (locationIds.length > 1) {
                  name = `${locationIds.length} Locations`;
                }

                if (name) {
                  return (
                    <g key={`${x}-${y}-group`}>
                      <text
                        key={`${x}-${y}`}
                        x={x}
                        y={y - labelSize}
                        fontSize={labelSize}
                        textAnchor="middle"
                        fill={"#fff"}
                        style={{
                          background: "none",
                          pointerEvents: "none",

                          paintOrder: "stroke",
                          stroke: "#000000",
                          strokeOpacity: backgroundImageUrl ? "100%" : "60%",
                          strokeWidth: labelOutlineWidth,
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                        }}
                        strokeWidth={labelOutlineWidth}
                        color={"#000"}
                      >
                        {name}
                      </text>
                    </g>
                  );
                } else {
                  return null;
                }
              });
          })}
        </svg>
        <Menu
          open={multiLocationChooserState.open}
          anchorEl={multiLocationChooserState.parentCell}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() =>
            setMultiLocationChooserState((prev) => ({ ...prev, open: false }))
          }
        >
          {multiLocationChooserState.locationIds.map((locationId) => {
            const location = locationMap[locationId];
            if (!location) return null;
            return (
              <ListItem
                key={locationId}
                onClick={() => {
                  setOpenLocationId(locationId);
                  setMultiLocationChooserState({
                    open: false,
                    locationIds: [],
                  });
                }}
                disablePadding
              >
                <ListItemButton onClick={() => setOpenLocationId(locationId)}>
                  <ListItemAvatar>
                    <LocationItemAvatar location={location} />
                  </ListItemAvatar>
                  <ListItemText>{location.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </Menu>
        <MapToolChooser
          currentTool={mapTool}
          setCurrentTool={setMapTool}
          locations={locationMap}
          currentLocationId={locationId}
        />
      </Box>
    </Box>
  );
}

const getConnections = (
  mapItems: ILocationMap,
  row: number,
  col: number,
  locationId: string,
  locations: Record<string, LocationWithGMProperties>
) => {
  const isEvenRow = row % 2 === 0;

  // Default connections
  const connections: LocationHexagonProps["pathConnections"] = {
    topLeft: false,
    topRight: false,
    left: false,
    right: false,
    bottomLeft: false,
    bottomRight: false,
  };

  // Check if there is a hexagon in the given direction
  const hasHexagon = (r: number, c: number): boolean => {
    const entry = mapItems[r]?.[c];
    if (!entry) return false;

    if (entry.type === MapEntryType.Path) return true;
    else if (entry.type === MapEntryType.Location)
      return checkIsLocationCell(entry, locationId, locations);
    return !!mapItems[r]?.[c]?.type;
  };

  if (isEvenRow) {
    connections.topLeft = hasHexagon(row - 1, col - 1);
    connections.topRight = hasHexagon(row - 1, col);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col - 1);
    connections.bottomRight = hasHexagon(row + 1, col);
  } else {
    connections.topLeft = hasHexagon(row - 1, col);
    connections.topRight = hasHexagon(row - 1, col + 1);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col);
    connections.bottomRight = hasHexagon(row + 1, col + 1);
  }

  return connections;
};
