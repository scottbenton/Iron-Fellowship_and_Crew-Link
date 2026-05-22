export const DEFAULT_MAP_ROWS = 13;
export const DEFAULT_MAP_COLS = 18;
export const DEFAULT_MAP_HEX_SIZE = 20;
export const MIN_MAP_ROWS = 3;
export const MIN_MAP_COLS = 3;
export const MIN_MAP_HEX_SIZE = 12;
export const MAX_MAP_HEX_SIZE = 40;
export const MAX_MAP_DIMENSION_INPUT = 30;
export const MAX_MAP_DIMENSIONS_PX = 675;

export function getColumnCountForRow(cols: number, row: number) {
  return cols - (row % 2 === 1 ? 1 : 0);
}

export function isCellOutOfBounds(
  row: number,
  col: number,
  rows: number,
  cols: number
) {
  return row >= rows || col >= getColumnCountForRow(cols, row);
}

export function calculateMaxColumns(width: number, hexSize: number) {
  const sqrt3 = Math.sqrt(3);
  const cols = (width - (hexSize * sqrt3) / 2 - 6) / (hexSize * sqrt3 - 1);
  return Math.floor(cols);
}

export function calculateWidthFromColumns(cols: number, hexSize: number) {
  return cols * hexSize * Math.sqrt(3) + (hexSize * Math.sqrt(3)) / 2 - cols + 6;
}

export function calculateHeightFromRows(rows: number, hexSize: number) {
  return rows * 1.5 * hexSize + hexSize / 2 + 1;
}

export function getMapLayout(params: {
  hexSize?: number;
  maxWidth?: number;
  maxHeight?: number;
  imageDimensions: { width: number; height: number } | null;
  mapRows?: number;
  mapCols?: number;
}) {
  const {
    imageDimensions,
    mapRows,
    mapCols,
    hexSize = DEFAULT_MAP_HEX_SIZE,
    maxWidth = MAX_MAP_DIMENSIONS_PX,
    maxHeight = MAX_MAP_DIMENSIONS_PX,
  } = params;

  let rows = mapRows ?? DEFAULT_MAP_ROWS;
  let cols = mapCols ?? DEFAULT_MAP_COLS;
  let width = calculateWidthFromColumns(cols, hexSize);
  let height = calculateHeightFromRows(rows, hexSize);
  let firstRowOffset = 0;
  let firstColOffset = 0;

  if (
    imageDimensions &&
    typeof mapRows !== "number" &&
    typeof mapCols !== "number"
  ) {
    const imageWidth = imageDimensions.width;
    const imageHeight = imageDimensions.height;
    const imageAspectRatio = imageWidth / imageHeight;
    const maxAspectRatio = maxWidth / maxHeight;

    if (imageAspectRatio > maxAspectRatio) {
      cols = calculateMaxColumns(maxWidth, hexSize);
      rows = Math.ceil((imageHeight / imageWidth) * cols);
      width = maxWidth;
      height = (maxWidth / imageWidth) * imageHeight;
    } else {
      rows = Math.floor(maxHeight / (1.5 * hexSize));
      width = (maxHeight / imageHeight) * imageWidth;
      cols = calculateMaxColumns(width, hexSize);
      height = maxHeight;
    }

    firstRowOffset = (height - calculateHeightFromRows(rows, hexSize)) / 2;
    firstColOffset = (width - calculateWidthFromColumns(cols, hexSize)) / 2;
  }

  return {
    rows,
    cols,
    width,
    height,
    firstRowOffset,
    firstColOffset,
  };
}
