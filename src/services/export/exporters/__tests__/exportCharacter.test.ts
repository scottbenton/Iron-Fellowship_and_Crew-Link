import { beforeEach, describe, expect, it, vi } from "vitest";
import { createExportFilenameTracker } from "services/export/exportFilename";
import { collectAsyncIterable } from "../../__tests__/testUtils";

const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  getCharacterForExport: vi.fn(),
  getCharacterAssetCollection: vi.fn(),
  getCharacterTracksCollection: vi.fn(),
  convertFromDatabase: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getDocs: mocks.getDocs,
}));
vi.mock("api-calls/character/getCharacterForExport", () => ({
  getCharacterForExport: mocks.getCharacterForExport,
}));
vi.mock("api-calls/assets/_getRef", () => ({
  getCharacterAssetCollection: mocks.getCharacterAssetCollection,
}));
vi.mock("api-calls/tracks/_getRef", () => ({
  convertFromDatabase: mocks.convertFromDatabase,
  getCharacterTracksCollection: mocks.getCharacterTracksCollection,
}));

import { CharacterExporter } from "../exportCharacter";

describe("CharacterExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCharacterTracksCollection.mockImplementation(
      (characterId: string) => `tracks:${characterId}`
    );
    mocks.getCharacterAssetCollection.mockImplementation(
      (characterId: string) => `assets:${characterId}`
    );
    mocks.convertFromDatabase.mockImplementation((track: unknown) => ({
      converted: track,
    }));
  });

  it("does not fetch character data just to count one output file", async () => {
    const exporter = new CharacterExporter({ characterId: "char-1" });

    await expect(exporter.count()).resolves.toBe(1);

    expect(mocks.getCharacterForExport).not.toHaveBeenCalled();
    expect(mocks.getDocs).not.toHaveBeenCalled();
  });

  it("exports character, tracks, and assets in one name-based JSON file", async () => {
    mocks.getCharacterForExport.mockResolvedValue({
      id: "char-1",
      data: {
        uid: "user-1",
        name: "Del Nar",
        stats: { edge: 2 },
        momentum: 3,
        profileImage: { filename: "portrait.png", position: { x: 0, y: 0 }, scale: 1 },
      },
    });
    mocks.getDocs.mockImplementation((collection: string) => {
      if (collection === "tracks:char-1") {
        return Promise.resolve({
          empty: false,
          docs: [{ id: "track-1", data: () => ({ value: 4 }) }],
        });
      }
      return Promise.resolve({
        empty: false,
        docs: [{ id: "asset-1", data: () => ({ name: "Blade" }) }],
      });
    });

    const exporter = new CharacterExporter({
      characterId: "char-1",
      filenameTracker: createExportFilenameTracker(),
    });
    const files = await collectAsyncIterable(exporter.run());

    expect(files).toHaveLength(1);
    expect(files[0].path).toBe("characters/del-nar.json");
    expect(JSON.parse(String(files[0].contents))).toMatchObject({
      name: "Del Nar",
      profileImageFilename: "portrait.png",
      tracks: { "track-1": { converted: { value: 4 } } },
      assets: { "asset-1": { name: "Blade" } },
    });
  });
});
