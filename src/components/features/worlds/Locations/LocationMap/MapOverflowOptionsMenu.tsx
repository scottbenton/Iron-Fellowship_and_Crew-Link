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
      if (!svg) throw new Error("Map SVG not found");

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

async function exportMapImage(svg: SVGSVGElement, container: HTMLDivElement) {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const width = Number(svg.getAttribute("width") ?? svg.clientWidth);
  const height = Number(svg.getAttribute("height") ?? svg.clientHeight);

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

  clonedSvg.setAttribute("xmlns", SVG_NAMESPACE);
  clonedSvg.setAttribute("xmlns:xlink", XLINK_NAMESPACE);
  clonedSvg.setAttribute("width", `${width}`);
  clonedSvg.setAttribute("height", `${height}`);
  clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  copyComputedStyles(svg, clonedSvg);

  // Fetch all external images and embed as data URLs so the serialized SVG
  // is self-contained and avoids CORS restrictions at canvas render time.
  await inlineImages(clonedSvg);

  const backgroundColor = findBackgroundColor(container);
  const backgroundRect = document.createElementNS(SVG_NAMESPACE, "rect");
  backgroundRect.setAttribute("x", "0");
  backgroundRect.setAttribute("y", "0");
  backgroundRect.setAttribute("width", `${width}`);
  backgroundRect.setAttribute("height", `${height}`);
  backgroundRect.setAttribute("fill", backgroundColor);
  clonedSvg.insertBefore(backgroundRect, clonedSvg.firstChild);

  const svgBlob = new Blob([new XMLSerializer().serializeToString(clonedSvg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width * MAP_EXPORT_SCALE;
    canvas.height = height * MAP_EXPORT_SCALE;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.scale(MAP_EXPORT_SCALE, MAP_EXPORT_SCALE);
    const image = await loadImage(objectUrl);
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function inlineImages(svg: SVGSVGElement) {
  const imageNodes = Array.from(svg.querySelectorAll("image"));

  await Promise.all(
    imageNodes.map(async (imageNode) => {
      const href =
        imageNode.getAttribute("href") ??
        imageNode.getAttributeNS(XLINK_NAMESPACE, "href");

      if (!href || href.startsWith("data:") || href.startsWith("blob:")) {
        return;
      }

      try {
        const dataUrl = await fetchAsDataUrl(href);
        imageNode.setAttribute("href", dataUrl);
        imageNode.setAttributeNS(XLINK_NAMESPACE, "xlink:href", dataUrl);
      } catch {
        // If we can't inline the image, remove it rather than leaving a
        // broken external reference that would taint the canvas.
        imageNode.remove();
      }
    })
  );
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status})`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function copyComputedStyles(
  sourceSvg: SVGSVGElement,
  targetSvg: SVGSVGElement
) {
  applyComputedStyle(sourceSvg, targetSvg);

  const sourceNodes = sourceSvg.querySelectorAll("*");
  const targetNodes = targetSvg.querySelectorAll("*");

  sourceNodes.forEach((sourceNode, index) => {
    const targetNode = targetNodes[index];
    if (targetNode) {
      applyComputedStyle(sourceNode, targetNode);
    }
  });
}

function applyComputedStyle(sourceNode: Element, targetNode: Element) {
  const computedStyle = window.getComputedStyle(sourceNode);
  const styledTarget = targetNode as SVGElement;

  STYLE_PROPERTIES_TO_COPY.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value) {
      styledTarget.style.setProperty(property, value);
    }
  });

  SVG_ATTRIBUTES_TO_COPY.forEach((attribute) => {
    const value =
      sourceNode.getAttribute(attribute) ??
      (attribute === "href"
        ? sourceNode.getAttributeNS(XLINK_NAMESPACE, "href")
        : null);

    if (!value) return;

    if (attribute === "href") {
      targetNode.setAttributeNS(XLINK_NAMESPACE, "xlink:href", value);
      targetNode.setAttribute("href", value);
      return;
    }

    targetNode.setAttribute(attribute, value);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load export image"));
    img.src = src;
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
