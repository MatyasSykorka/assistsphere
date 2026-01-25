"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  createAppTheme,
  DEFAULT_THEME_PRESET,
  isThemePreset,
  type ThemePreset,
} from "@/theme";

const STORAGE_KEY = "assistsphere.themePreset";

type ThemePresetContextValue = {
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
};

const ThemePresetContext = React.createContext<ThemePresetContextValue | null>(
  null,
);

export function useThemePreset() {
  const ctx = React.useContext(ThemePresetContext);
  if (!ctx) {
    throw new Error("useThemePreset must be used within <Providers />");
  }
  return ctx;
}

export default function Providers({
  children,
  initialPreset,
}: {
  children: React.ReactNode;
  initialPreset?: ThemePreset;
}) {
  const [preset, setPreset] = React.useState<ThemePreset>(
    initialPreset ?? DEFAULT_THEME_PRESET,
  );
  const { data: session } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);
  const skipNextSaveRef = React.useRef(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (initialPreset) {
      window.localStorage.setItem(STORAGE_KEY, initialPreset);
      return;
    }

    // Priority: ?theme=... -> localStorage -> default
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("theme");
    if (isThemePreset(fromUrl)) {
      setPreset(fromUrl);
      return;
    }

    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isThemePreset(fromStorage)) {
      setPreset(fromStorage);
    }
  }, [initialPreset]);

  React.useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me/theme", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as { preset?: unknown };
        if (!cancelled && isThemePreset(data.preset)) {
          // Avoid writing back immediately after we apply the DB value.
          skipNextSaveRef.current = true;
          setPreset(data.preset);
          window.localStorage.setItem(STORAGE_KEY, data.preset);
        }
      } catch {
        // Ignore; localStorage fallback stays active.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, preset);

    if (!isLoggedIn) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    // Fire-and-forget; if DB isn't migrated yet, UI still works.
    void fetch("/api/me/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset }),
    });
  }, [preset]);

  const effectivePreset = React.useMemo<ThemePreset>(() => {
    // Always keep auth pages light.
    if (pathname === "/login" || pathname === "/register") return "light";

    // Keep home page light only for guests.
    if (!isLoggedIn && pathname === "/") return "light";

    return preset;
  }, [isLoggedIn, pathname, preset]);

  const theme = React.useMemo(
    () => createAppTheme(effectivePreset),
    [effectivePreset],
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemePresetContext.Provider value={{ preset, setPreset }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemePresetContext.Provider>
    </AppRouterCacheProvider>
  );
}
