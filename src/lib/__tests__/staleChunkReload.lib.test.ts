import { describe, expect, it, vi } from "vitest";
import {
  goToLatestBuild,
  reloadForStaleChunk,
  STALE_CHUNK_RELOAD_GUARD_MS,
} from "../staleChunkReload.lib";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe("reloadForStaleChunk", () => {
  it("reloads the first time a chunk fails to load", () => {
    const reload = vi.fn();
    expect(
      reloadForStaleChunk({
        storage: memoryStorage(),
        now: () => 1000,
        reload,
      })
    ).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("does not reload again right after a reload, so a missing chunk can't loop", () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    reloadForStaleChunk({ storage, now: () => 1000, reload });
    expect(
      reloadForStaleChunk({
        storage,
        now: () => 1000 + STALE_CHUNK_RELOAD_GUARD_MS - 1,
        reload,
      })
    ).toBe(false);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("reloads again for a later deploy once the guard has passed", () => {
    const storage = memoryStorage();
    const reload = vi.fn();
    reloadForStaleChunk({ storage, now: () => 1000, reload });
    expect(
      reloadForStaleChunk({
        storage,
        now: () => 1000 + STALE_CHUNK_RELOAD_GUARD_MS,
        reload,
      })
    ).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does not reload when storage is unavailable", () => {
    const reload = vi.fn();
    const storage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(reloadForStaleChunk({ storage, now: () => 1000, reload })).toBe(
      false
    );
    expect(reload).not.toHaveBeenCalled();
  });
});

describe("goToLatestBuild", () => {
  it("goes to the page being navigated to, which isn't in the URL yet", () => {
    const location = { assign: vi.fn(), reload: vi.fn() };
    goToLatestBuild("/characters", location);
    expect(location.assign).toHaveBeenCalledWith("/characters");
    expect(location.reload).not.toHaveBeenCalled();
  });

  it("reloads the current page when no navigation is in progress", () => {
    const location = { assign: vi.fn(), reload: vi.fn() };
    goToLatestBuild(null, location);
    expect(location.reload).toHaveBeenCalledOnce();
    expect(location.assign).not.toHaveBeenCalled();
  });
});
