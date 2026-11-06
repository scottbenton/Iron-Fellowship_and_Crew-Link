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
 * @param afterPendingNavigation Runs the callback once any navigation in
 * progress has finished. React Router pushes a navigation's URL only after its
 * lazy route has loaded, so reloading straight away would reload the page the
 * user was leaving, and going to the new URL would add a second history entry
 * once the router pushes it.
 */
export function installStaleChunkReload(
  afterPendingNavigation: (callback: () => void) => void
) {
  window.addEventListener("vite:preloadError", (event) => {
    const reloaded = reloadForStaleChunk({
      storage: window.sessionStorage,
      now: () => Date.now(),
      reload: () => afterPendingNavigation(() => window.location.reload()),
    });
    if (reloaded) {
      // The failed import then resolves to nothing: the router finishes the
      // navigation with an empty page, which the reload replaces, rather than
      // showing an error page.
      event.preventDefault();
    }
  });
}
