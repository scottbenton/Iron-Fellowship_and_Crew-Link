import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { MapBackgroundImageFit, MapStrokeColors } from "types/Locations.type";
import OverflowMenuIcon from "@mui/icons-material/MoreHoriz";
import { useStore } from "stores/store";
import { useSnackbar } from "providers/SnackbarProvider";
import { useConfirm } from "material-ui-confirm";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";

const MAP_EXPORT_SCALE = 4;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
const STYLE_PROPERTIES_TO_COPY = [
  "background-color",
  "color",
  "fill",
  "fill-opacity",
  "font-family",
  "font-size",
  "font-weight",
  "opacity",
  "overflow",
  "paint-order",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "transform-origin",
  "transform-box",
] as const;

const SVG_ATTRIBUTES_TO_COPY = [
  "clip-path",
  "cx",
  "cy",
  "d",
  "fill",
  "fill-opacity",
  "height",
  "href",
  "opacity",
  "points",
  "preserveAspectRatio",
  "r",
  "rx",
  "ry",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-opacity",
  "stroke-width",
  "transform",
  "viewBox",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2",
] as const;

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
      const svg = mapContainerRef.current.querySelector("svg");
      if (!svg) {
        throw new Error("Map SVG not found");
      }

      const dataUrl = await exportMapImage(svg, mapContainerRef.current);
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

async function exportMapImage(
  svg: SVGSVGElement,
  container: HTMLDivElement
) {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const { width, height } = getSvgDimensions(svg);
  const preparedSvg = cloneSvgForExport(svg, container, {
    includeImages: false,
    width,
    height,
  });
  const serializedSvg = new XMLSerializer().serializeToString(preparedSvg);
  const svgBlob = new Blob([serializedSvg], {
    type: "image/svg+xml;charset=utf-8",
  });

  return renderSvgBlobToPng(svgBlob, svg, width, height);
}

function cloneSvgForExport(
  svg: SVGSVGElement,
  container: HTMLDivElement,
  options: {
    includeImages: boolean;
    width: number;
    height: number;
  }
) {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  const { includeImages, width, height } = options;
  const backgroundColor = findBackgroundColor(container);

  clonedSvg.setAttribute("xmlns", SVG_NAMESPACE);
  clonedSvg.setAttribute("xmlns:xlink", XLINK_NAMESPACE);
  clonedSvg.setAttribute("width", `${width}`);
  clonedSvg.setAttribute("height", `${height}`);
  clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  copyComputedStyles(svg, clonedSvg);

  if (!includeImages) {
    clonedSvg
      .querySelectorAll("image")
      .forEach((imageNode) => imageNode.remove());
  }

  const backgroundRect = document.createElementNS(SVG_NAMESPACE, "rect");
  backgroundRect.setAttribute("x", "0");
  backgroundRect.setAttribute("y", "0");
  backgroundRect.setAttribute("width", `${width}`);
  backgroundRect.setAttribute("height", `${height}`);
  backgroundRect.setAttribute("fill", backgroundColor);
  clonedSvg.insertBefore(backgroundRect, clonedSvg.firstChild);

  return clonedSvg;
}

function copyComputedStyles(sourceSvg: SVGSVGElement, targetSvg: SVGSVGElement) {
  applyComputedStyle(sourceSvg, targetSvg);

  const sourceNodes = sourceSvg.querySelectorAll("*");
  const targetNodes = targetSvg.querySelectorAll("*");

  sourceNodes.forEach((sourceNode, index) => {
    const targetNode = targetNodes[index];
    if (!targetNode) {
      return;
    }

    applyComputedStyle(sourceNode, targetNode);
  });
}

function applyComputedStyle(sourceNode: Element, targetNode: Element) {
  const computedStyle = window.getComputedStyle(sourceNode);
  const styledTargetNode = targetNode as SVGElement;

  STYLE_PROPERTIES_TO_COPY.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value) {
      styledTargetNode.style.setProperty(property, value);
    }
  });

  SVG_ATTRIBUTES_TO_COPY.forEach((attribute) => {
    const value =
      sourceNode.getAttribute(attribute) ??
      (attribute === "href"
        ? sourceNode.getAttributeNS(XLINK_NAMESPACE, "href")
        : null);

    if (!value) {
      return;
    }

    if (attribute === "href") {
      targetNode.setAttributeNS(XLINK_NAMESPACE, "xlink:href", value);
      targetNode.setAttribute("href", value);
      return;
    }

    targetNode.setAttribute(attribute, value);
  });
}

async function renderSvgBlobToPng(
  svgBlob: Blob,
  sourceSvg: SVGSVGElement,
  width: number,
  height: number
) {
  const scale = MAP_EXPORT_SCALE;
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context not available");
    }

    context.scale(scale, scale);
    await drawSvgImagesToCanvas(sourceSvg, context);

    const image = await loadImage(objectUrl);
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load export image"));
    image.src = src;
  });
}

function getSvgDimensions(svg: SVGSVGElement) {
  return {
    width: Number(svg.getAttribute("width") ?? svg.clientWidth),
    height: Number(svg.getAttribute("height") ?? svg.clientHeight),
  };
}

async function drawSvgImagesToCanvas(
  sourceSvg: SVGSVGElement,
  context: CanvasRenderingContext2D
) {
  const sourceImages = Array.from(sourceSvg.querySelectorAll("image"));

  for (const sourceImage of sourceImages) {
    const href =
      sourceImage.getAttribute("href") ??
      sourceImage.getAttributeNS(XLINK_NAMESPACE, "href");

    if (!href) {
      continue;
    }

    const image = await loadRenderableImage(href);
    drawSvgImageToCanvas(context, sourceImage, image);
  }
}

async function loadRenderableImage(src: string) {
  if (src.startsWith("data:")) {
    return loadImage(src);
  }

  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to fetch image data (${response.status}).`);
  }

  const imageBlob = await response.blob();
  const objectUrl = URL.createObjectURL(imageBlob);

  try {
    return await loadImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function drawSvgImageToCanvas(
  context: CanvasRenderingContext2D,
  sourceImage: SVGImageElement,
  image: HTMLImageElement
) {
  const x = Number(sourceImage.getAttribute("x") ?? 0);
  const y = Number(sourceImage.getAttribute("y") ?? 0);
  const width = Number(sourceImage.getAttribute("width") ?? image.naturalWidth);
  const height = Number(
    sourceImage.getAttribute("height") ?? image.naturalHeight
  );
  const preserveAspectRatio =
    sourceImage.getAttribute("preserveAspectRatio") ?? "xMidYMid meet";

  if (preserveAspectRatio === "none") {
    context.drawImage(image, x, y, width, height);
    return;
  }

  const imageAspectRatio = image.naturalWidth / image.naturalHeight;
  const targetAspectRatio = width / height;
  const shouldSlice = preserveAspectRatio.includes("slice");
  const scale =
    shouldSlice
      ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
      : Math.min(width / image.naturalWidth, height / image.naturalHeight);

  const drawWidth =
    imageAspectRatio > targetAspectRatio && !shouldSlice
      ? width
      : image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
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
