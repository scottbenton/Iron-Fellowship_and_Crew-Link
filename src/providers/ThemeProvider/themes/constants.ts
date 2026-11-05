import { Color, PaletteColorOptions } from "@mui/material";

// Primary Colors
export const sunsetPink: PaletteColorOptions = {
  light: "#ff8093",
  main: "#ff6584",
  dark: "#ff4d79",
};
// Light mode versions, dark enough to read as text and icons on white
// (at least 4.5:1). Filled buttons then use white text.
export const sunsetPinkLight: PaletteColorOptions = {
  light: "#ff8093",
  main: "#e0274c",
  dark: "#c91d3f",
};
export const hinterlandsGreen: PaletteColorOptions = {
  light: "#059669",
  main: "#047857",
  dark: "#065f46",
};
export const eidolonGold: PaletteColorOptions = {
  light: "#eab308",
  main: "#ca8a04",
  dark: "#a16207",
};
export const eidolonGoldLight: PaletteColorOptions = {
  light: "#ca8a04",
  main: "#a16207",
  dark: "#854d0e",
};
export const myriadTeal: PaletteColorOptions = {
  light: "#2dd4bf",
  main: "#14b8a6",
  dark: "#0d9488",
  contrastText: "#042f2e",
};
export const myriadTealLight: PaletteColorOptions = {
  light: "#0d9488",
  main: "#0f766e",
  dark: "#115e59",
};

// Grays
export const stone: Color & { 950: string } = {
  [50]: "#fafafa",
  [100]: "#f4f4f6",
  [200]: "#e4e4e7",
  [300]: "#d4d4d8",
  [400]: "#a1a1aa",
  [500]: "#71717a",
  [600]: "#52525b",
  [700]: "#3f3f46",
  [800]: "#27272a",
  [900]: "#18181b",
  [950]: "#09090b",
  A100: "#f4f4f5",
  A200: "#e4e4e7",
  A400: "#a1a1aa",
  A700: "#3f3f46",
}; // grayer-gray
export const slate: Color & { 950: string } = {
  [50]: "#f8fafc",
  [100]: "#f1f5f9",
  [200]: "#e2e8f0",
  [300]: "#cbd5e1",
  [400]: "#94a3b8",
  [500]: "#64748b",
  [600]: "#475569",
  [700]: "#334155",
  [800]: "#1e293b",
  [900]: "#0f172a",
  [950]: "#020617",
  A100: "#f3f4f6",
  A200: "#e5e7eb",
  A400: "#9ca3af",
  A700: "#374151",
}; // deep blue-gray
export const blueGray: Color & { 950: string } = {
  [50]: "#f9fafb",
  [100]: "#f3f4f6",
  [200]: "#e5e7eb",
  [300]: "#d1d5db",
  [400]: "#9ca3af",
  [500]: "#6b7280",
  [600]: "#4b5563",
  [700]: "#374151",
  [800]: "#1f2937",
  [900]: "#111827",
  [950]: "#030712",
  A100: "#f3f4f6",
  A200: "#e5e7eb",
  A400: "#9ca3af",
  A700: "#374151",
}; // light blue gray

// Common
export const sharedStatusColors = {
  success: {
    light: "#10b981",
    main: "#059669",
    dark: "#047857",
  },
  warning: {
    light: "#d97706",
    main: "#b45309",
    dark: "#92400e",
  },
  error: {
    light: "#ef4444",
    main: "#dc2626",
    dark: "#b91c1c",
  },
  info: {
    light: "#0ea5e9",
    main: "#0284c7",
    dark: "#0369a1",
  },
};

export const baseFontFamilies = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];
