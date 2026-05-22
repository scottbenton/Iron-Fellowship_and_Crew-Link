import { GameIcon } from "components/shared/GameIcons/GameIcon";
import { mergeIcons } from "components/shared/GameIcons/mergeIcons";
import { locationConfigs } from "config/locations.config";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { IconColors } from "types/Icon.type";
import { MapEntry, MapEntryType, MapStrokeColors } from "types/Locations.type";
import { backgroundColors } from "./backgroundColors";
import { getValidLocations } from "./checkIsLocationCell";

const mapStrokeColors: Record<MapStrokeColors, string> = {
  [MapStrokeColors.Light]: "#ccc",
  [MapStrokeColors.Dark]: "#333",
};

const ICON_SIZE_MULTIPLIER = 1.25;

export interface LocationHexagonProps {
  x: number;
  y: number;
  size: number;
  locationId: string;
  locationMap: Record<string, LocationWithGMProperties>;
  mapEntry?: MapEntry;
  hasBackgroundImage?: boolean;
  pathConnections?: {
    topLeft?: boolean;
    topRight?: boolean;
    left?: boolean;
    right?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  onClick?: (ref: SVGPolygonElement) => void;
  onMouseDown?: (ref: SVGPolygonElement) => void;
  onMouseUp?: (ref: SVGPolygonElement) => void;
  onMouseEnter?: (ref: SVGPolygonElement) => void;
  mapStrokeColor: MapStrokeColors;
}

export function LocationHexagon(props: LocationHexagonProps) {
  const {
    x,
    y,
    size,
    locationId,
    mapEntry,
    locationMap,
    pathConnections,
    hasBackgroundImage,
    onClick,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    mapStrokeColor,
  } = props;

  const locationIds =
    mapEntry?.type === MapEntryType.Location
      ? getValidLocations(locationId, locationMap, mapEntry.locationIds)
      : [];
  const locations = locationIds.map((id) => locationMap[id]);

  const firstLocation =
    (locations.length ?? 0) > 0 ? locations?.[0] : undefined;

  const settingId = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironlands",
    [GAME_SYSTEMS.STARFORGED]: "forge",
  });
  let settingConfig = { ...locationConfigs[settingId] };
  if (
    firstLocation?.type &&
    settingConfig.locationTypeOverrides?.[firstLocation.type]
  ) {
    settingConfig = {
      ...settingConfig,
      ...settingConfig.locationTypeOverrides[firstLocation.type]?.config,
    };
  }

  const icon = mergeIcons(
    { key: "GiCompass", color: IconColors.White },
    settingConfig.defaultIcon,
    firstLocation?.icon
  );

  const pointString = getPoints(x, y, size);

  const sides = getHexagonVertices(x, y, size);

  const topY = y - size;
  const leftX = x - (size * Math.sqrt(3)) / 2;
  const hexWidth = size * Math.sqrt(3);
  const hexHeight = size * 2;
  const iconSize = size * ICON_SIZE_MULTIPLIER;
  const iconStrokeWidth = Math.max(
    1.5,
    size * (hasBackgroundImage ? 0.15 : 0.1)
  );

  const sideMidpoints = {
    topLeft: [
      (sides.topLeft[0] + sides.top[0]) / 2,
      (sides.topLeft[1] + sides.top[1]) / 2,
    ],
    topRight: [
      (sides.top[0] + sides.topRight[0]) / 2,
      (sides.top[1] + sides.topRight[1]) / 2,
    ],
    left: [
      (sides.topLeft[0] + sides.bottomLeft[0]) / 2,
      (sides.topLeft[1] + sides.bottomLeft[1]) / 2,
    ],
    right: [
      (sides.topRight[0] + sides.bottomRight[0]) / 2,
      (sides.topRight[1] + sides.bottomRight[1]) / 2,
    ],
    bottomLeft: [
      (sides.bottomLeft[0] + sides.bottom[0]) / 2,
      (sides.bottomLeft[1] + sides.bottom[1]) / 2,
    ],
    bottomRight: [
      (sides.bottom[0] + sides.bottomRight[0]) / 2,
      (sides.bottom[1] + sides.bottomRight[1]) / 2,
    ],
  };

  return (
    <>
      <defs>
        <clipPath id={`clipPolygon-${x}-${y}`}>
          <polygon points={pointString} />
        </clipPath>
      </defs>

      {mapEntry?.background?.color && (
        <polygon
          points={pointString}
          fill={backgroundColors[mapEntry.background.color]?.color}
          onClick={onClick ? (evt) => onClick(evt.currentTarget) : undefined}
        />
      )}

      {firstLocation &&
        (firstLocation.imageUrl ? (
          <image
            width={hexWidth}
            height={hexHeight}
            href={firstLocation.imageUrl}
            preserveAspectRatio="xMidYMid slice"
            style={{
              background: "none",
              pointerEvents: "none",
            }}
            x={leftX}
            y={topY}
            clipPath={`url(#clipPolygon-${x}-${y})`}
          />
        ) : (
          <GameIcon
            iconName={icon.key}
            iconColor={icon.color}
            sx={{
              background: "none",
              pointerEvents: "none",
              overflow: "visible",
              width: iconSize,
              height: iconSize,
              "& path": {
                paintOrder: "stroke",
                strokeWidth: `${iconStrokeWidth}px`,
                strokeOpacity: hasBackgroundImage ? "100%" : "60%",
                stroke: "black",
              },
            }}
            x={x - iconSize / 2}
            y={y - iconSize / 2}
          />
        ))}
      <polygon
        className={"hexagon"}
        points={pointString}
        stroke={
          hasBackgroundImage
            ? mapStrokeColors[mapStrokeColor]
            : mapEntry?.background?.color
            ? "#000"
            : "currentcolor"
        }
        strokeOpacity={
          hasBackgroundImage
            ? "25%"
            : mapEntry?.background?.color
            ? "15%"
            : "100%"
        }
        fill={"transparent"}
        strokeWidth="1"
        onClick={onClick ? (evt) => onClick(evt.currentTarget) : undefined}
        onMouseDown={
          onMouseDown ? (evt) => onMouseDown(evt.currentTarget) : undefined
        }
        onMouseUp={
          onMouseUp ? (evt) => onMouseUp(evt.currentTarget) : undefined
        }
        onMouseEnter={
          onMouseEnter ? (evt) => onMouseEnter(evt.currentTarget) : undefined
        }
      />
      {mapEntry?.type === MapEntryType.Path &&
        (!pathConnections ||
          Object.keys(pathConnections).filter(
            (connection) =>
              !!pathConnections[connection as keyof typeof pathConnections]
          ).length === 0) && (
          <circle
            cx={x}
            cy={y}
            r={size / 4}
            className={"path-line"}
            fill={"none"}
            strokeWidth={1}
            stroke={mapStrokeColors[mapStrokeColor]}
            style={{
              background: "none",
              pointerEvents: "none",
              height: 0,
              overflow: "visible",
            }}
          />
        )}
      {mapEntry?.type === MapEntryType.Path &&
        pathConnections &&
        Object.keys(pathConnections)
          .filter(
            (connection) =>
              pathConnections[connection as keyof typeof pathConnections]
          )
          .map((connection) => {
            const [midX, midY] =
              sideMidpoints[connection as keyof typeof pathConnections];

            return (
              <line
                key={connection}
                className={"path-line"}
                x1={midX}
                y1={midY}
                x2={x}
                y2={y}
                stroke={mapStrokeColors[mapStrokeColor]}
                strokeWidth="1"
                style={{
                  background: "none",
                  pointerEvents: "none",
                  height: 0,
                  overflow: "visible",
                }}
              />
            );
          })}
    </>
  );
}
// Updated hexagon function to create a pointy-topped hexagon.
const getPoints = (x: number, y: number, s: number): string => {
  return `${x},${y - s} ${x + (s * Math.sqrt(3)) / 2},${y - s / 2} ${
    x + (s * Math.sqrt(3)) / 2
  },${y + s / 2} ${x},${y + s} ${x - (s * Math.sqrt(3)) / 2},${y + s / 2} ${
    x - (s * Math.sqrt(3)) / 2
  },${y - s / 2}`;
};

const getHexagonVertices = (x: number, y: number, s: number) => {
  const vertices = {
    top: [x, y - s],
    topRight: [x + (s * Math.sqrt(3)) / 2, y - s / 2],
    bottomRight: [x + (s * Math.sqrt(3)) / 2, y + s / 2],
    bottom: [x, y + s],
    bottomLeft: [x - (s * Math.sqrt(3)) / 2, y + s / 2],
    topLeft: [x - (s * Math.sqrt(3)) / 2, y - s / 2],
  };

  return vertices;
};
