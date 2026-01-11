import { createTheme, type ThemeOptions } from "@mui/material/styles";

export const THEME_PRESETS = [
  "light",
  "dark",
  "blue",
  "blueDark",
  "orange",
  "orangeDark",
  "red",
  "redDark",
  "purple",
  "purpleDark",
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number];

export const DEFAULT_THEME_PRESET: ThemePreset = "light";

export function isThemePreset(value: unknown): value is ThemePreset {
  return typeof value === "string" && (THEME_PRESETS as readonly string[]).includes(value);
}

const baseThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      "var(--font-geist-sans), Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
  },
  components: {
    MuiContainer: {
      defaultProps: {
        // Default to full width across the app; individual pages can override.
        maxWidth: false,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
};

function getThemeOptions(preset: ThemePreset): ThemeOptions {
  switch (preset) {
    case "dark":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "dark",
          primary: { main: "#3B82F6" },
          secondary: { main: "#A78BFA" },
          background: {
            default: "#0B1220",
            paper: "#121A2B",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
          divider: "rgba(255,255,255,0.12)",
        },
      };

    case "blue":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "light",
          primary: { main: "#2563EB" },
          secondary: { main: "#06B6D4" },
          background: {
            default: "#F2F7FF",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#0F172A",
            secondary: "#334155",
          },
          divider: "rgba(15,23,42,0.12)",
        },
      };

    case "blueDark":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "dark",
          primary: { main: "#60A5FA" },
          secondary: { main: "#22D3EE" },
          background: {
            default: "#081225",
            paper: "#0F1B33",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
          divider: "rgba(255,255,255,0.12)",
        },
      };

    case "orange":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "light",
          primary: { main: "#F97316" },
          secondary: { main: "#FB7185" },
          background: {
            default: "#FFF7ED",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
          },
          divider: "rgba(15,23,42,0.12)",
        },
      };

    case "orangeDark":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "dark",
          primary: { main: "#FB923C" },
          secondary: { main: "#F472B6" },
          background: {
            default: "#1A0F0B",
            paper: "#23150F",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
          divider: "rgba(255,255,255,0.12)",
        },
      };

    case "red":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "light",
          primary: { main: "#DC2626" },
          secondary: { main: "#0EA5E9" },
          background: {
            default: "#FEF2F2",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
          },
          divider: "rgba(15,23,42,0.12)",
        },
      };

    case "redDark":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "dark",
          primary: { main: "#F87171" },
          secondary: { main: "#38BDF8" },
          background: {
            default: "#190B0E",
            paper: "#241014",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
          divider: "rgba(255,255,255,0.12)",
        },
      };

    case "purple":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "light",
          primary: { main: "#7C3AED" },
          secondary: { main: "#EC4899" },
          background: {
            default: "#F5F3FF",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
          },
          divider: "rgba(15,23,42,0.12)",
        },
      };

    case "purpleDark":
      return {
        ...baseThemeOptions,
        palette: {
          mode: "dark",
          primary: { main: "#C4B5FD" },
          secondary: { main: "#F472B6" },
          background: {
            default: "#0F0B1A",
            paper: "#171226",
          },
          text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
          },
          divider: "rgba(255,255,255,0.12)",
        },
      };

    case "light":
    default:
      return {
        ...baseThemeOptions,
        palette: {
          mode: "light",
          primary: { main: "#1976D2" },
          secondary: { main: "#7C4DFF" },
          background: {
            default: "#F6F7FB",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#111827",
            secondary: "#4B5563",
          },
          divider: "rgba(17,24,39,0.12)",
        },
      };
  }
}

export function createAppTheme(preset: ThemePreset) {
  return createTheme(getThemeOptions(preset));
}
