import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { MapBackgroundImageFit, MapStrokeColors } from "types/Locations.type";
import OverflowMenuIcon from "@mui/icons-material/MoreHoriz";
import { useStore } from "stores/store";
import { useSnackbar } from "providers/SnackbarProvider";
import { useConfirm } from "material-ui-confirm";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "lib/storage.lib";

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

  const handleMapExport = async (format: "png" | "svg") => {
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

      const dataUrl = await exportMapImage(svg, mapContainerRef.current, format);
      const link = document.createElement("a");
      link.download = `${getExportFileName()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch {
      error(`Failed to export location map as ${format.toUpperCase()}.`);
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
            handleMapExport("png").catch(() => {});
          }}
        >
          Export as PNG
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMapExport("svg").catch(() => {});
          }}
        >
          Export as SVG
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

async function exportMapImage(
  svg: SVGSVGElement,
  container: HTMLDivElement,
  format: "png" | "svg"
) {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const preparedSvg = await cloneSvgForExport(svg, container);
  const serializedSvg = new XMLSerializer().serializeToString(preparedSvg);
  const svgBlob = new Blob([serializedSvg], {
    type: "image/svg+xml;charset=utf-8",
  });

  if (format === "svg") {
    return convertBlobToDataUrl(svgBlob);
  }

  return renderSvgBlobToPng(svgBlob, preparedSvg);
}

async function cloneSvgForExport(
  svg: SVGSVGElement,
  container: HTMLDivElement
) {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  const width = Number(svg.getAttribute("width") ?? svg.clientWidth);
  const height = Number(svg.getAttribute("height") ?? svg.clientHeight);
  const backgroundColor = findBackgroundColor(container);

  clonedSvg.setAttribute("xmlns", SVG_NAMESPACE);
  clonedSvg.setAttribute("xmlns:xlink", XLINK_NAMESPACE);
  clonedSvg.setAttribute("width", `${width}`);
  clonedSvg.setAttribute("height", `${height}`);
  clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  copyComputedStyles(svg, clonedSvg);
  await inlineSvgImages(svg, clonedSvg);

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

async function inlineSvgImages(
  sourceSvg: SVGSVGElement,
  targetSvg: SVGSVGElement
) {
  const sourceImages = sourceSvg.querySelectorAll("image");
  const targetImages = targetSvg.querySelectorAll("image");

  await Promise.all(
    Array.from(sourceImages).map(async (sourceImage, index) => {
      const targetImage = targetImages[index];
      if (!targetImage) {
        return;
      }

      const href =
        sourceImage.getAttribute("href") ??
        sourceImage.getAttributeNS(XLINK_NAMESPACE, "href");

      if (!href || href.startsWith("data:")) {
        return;
      }

      const dataUrl = await convertImageToDataUrl(href);
      targetImage.setAttribute("href", dataUrl);
      targetImage.setAttributeNS(XLINK_NAMESPACE, "xlink:href", dataUrl);
    })
  );
}

async function convertImageToDataUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch image data");
  }

  const imageBlob = await response.blob();

  return convertBlobToDataUrl(imageBlob);
}

function convertBlobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image data"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function renderSvgBlobToPng(svgBlob: Blob, svg: SVGSVGElement) {
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(objectUrl);
    const width = Number(svg.getAttribute("width"));
    const height = Number(svg.getAttribute("height"));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas context not available");
    }

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
