import { SECTOR_HEX_TYPES, hexTypeMap } from "./hexTypes";

export interface SectorHexagonProps {
  x: number;
  y: number;
  size: number;
  type?: SECTOR_HEX_TYPES;
  pathConnections?: {
    topLeft?: boolean;
    topRight?: boolean;
    left?: boolean;
    right?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  onClick?: () => void;
}

export function SectorHexagon(props: SectorHexagonProps) {
  const { x, y, size, type, pathConnections, onClick } = props;

  const { Icon, color } = type
    ? hexTypeMap[type] ?? {}
    : ({} as (typeof hexTypeMap)[SECTOR_HEX_TYPES.SHIP]);

  const pointString = getPoints(x, y, size);

  const sides = getHexagonVertices(x, y, size);

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
      <polygon
        className={"hexagon" + (type ? ` ${type}` : "")}
        points={pointString}
        stroke={"currentcolor"}
        strokeWidth="1"
        onClick={onClick}
      />
      {type === SECTOR_HEX_TYPES.PATH &&
        (!pathConnections ||
          Object.keys(pathConnections).filter(
            (connection) =>
              !!pathConnections[connection as keyof typeof pathConnections]
          ).length === 0) && (
          <circle
            cx={x}
            cy={y}
            r={size / 4}
            stroke={"currentcolor"}
            strokeWidth={1}
          />
        )}
      {pathConnections &&
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
                stroke={"currentcolor"}
                strokeWidth="1"
              />
            );
          })}
      {type && type !== SECTOR_HEX_TYPES.PATH && Icon && (
        <Icon
          sx={{
            color: color ?? "#fff",
            background: "none",
            pointerEvents: "none",
            height: 0,
            overflow: "visible",
          }}
          width={size * 1.25}
          height={size * 1.25}
          x={x - (size * 1.25) / 2}
          y={y - (size * 1.25) / 2}
        />
      )}
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
