// After a deploy, the hashed chunk files of the previous build are gone. A tab
// that is still running the old build then fails to load a lazy route or
// dataset chunk. Vite reports that as `vite:preloadError`; reloading picks up
// the new build. The guard stops a reload loop if the chunk is missing for
// some other reason, in which case the error reaches the route's error page.

const LAST_RELOAD_KEY = "stale-chunk-reload-at";
export const STALE_CHUNK_RELOAD_GUARD_MS = 10_000;

interface StaleChunkReloadDeps {
  storage: Pick<Storage, "getItem" | "setItem">;
  now: () => number;
  reload: () => void;
}

/** Reloads unless a reload for the same reason happened moments ago. Returns whether it reloaded. */
export function reloadForStaleChunk(deps: StaleChunkReloadDeps): boolean {
  const { storage, now, reload } = deps;
  const currentTime = now();

  let lastReload: number | null = null;
  try {
    const stored = storage.getItem(LAST_RELOAD_KEY);
    lastReload = stored ? Number(stored) : null;
  } catch {
    // Storage can be unavailable (private mode); without it we can't guard,
    // so don't reload at all rather than risk a loop.
    return false;
  }

  if (
    lastReload !== null &&
    Number.isFinite(lastReload) &&
    currentTime - lastReload < STALE_CHUNK_RELOAD_GUARD_MS
  ) {
    return false;
  }

  try {
    storage.setItem(LAST_RELOAD_KEY, String(currentTime));
  } catch {
    return false;
  }
  reload();
  return true;
}

/**
 * Loads the latest build. When the chunk was for a route being navigated to,
 * React Router hasn't pushed that URL yet (it pushes once the route has
 * loaded), so go to the destination rather than reloading the current page.
 */
export function goToLatestBuild(
  navigationTarget: string | null,
  location: Pick<Location, "assign" | "reload">
) {
  if (navigationTarget) {
    location.assign(navigationTarget);
  } else {
    location.reload();
  }
}

/** @param getNavigationTarget The href of the navigation in progress, if any. */
export function installStaleChunkReload(
  getNavigationTarget: () => string | null
) {
  window.addEventListener("vite:preloadError", (event) => {
    const reloaded = reloadForStaleChunk({
      storage: window.sessionStorage,
      now: () => Date.now(),
      reload: () => goToLatestBuild(getNavigationTarget(), window.location),
    });
    if (reloaded) {
      // Keep the failed import from surfacing an error page while the page reloads.
      event.preventDefault();
    }
  });
}
