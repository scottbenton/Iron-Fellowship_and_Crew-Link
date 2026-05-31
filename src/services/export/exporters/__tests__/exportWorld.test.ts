import { beforeEach, describe, expect, it, vi } from "vitest";
import { collectAsyncIterable } from "../../__tests__/testUtils";

const mocks = vi.hoisted(() => ({
  getCountFromServer: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getWorldForExport: vi.fn(),
  getAllNPCsForExport: vi.fn(),
  getAllLoreForExport: vi.fn(),
  getAllLocationsForExport: vi.fn(),
  yjsUpdateToMarkdown: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getCountFromServer: mocks.getCountFromServer,
  query: mocks.query,
  where: mocks.where,
}));
vi.mock("api-calls/world/getWorldForExport", () => ({
  getWorldForExport: mocks.getWorldForExport,
}));
vi.mock("api-calls/world/npcs/getAllNPCsForExport", () => ({
  getAllNPCsForExport: mocks.getAllNPCsForExport,
}));
vi.mock("api-calls/world/lore/getAllLoreForExport", () => ({
  getAllLoreForExport: mocks.getAllLoreForExport,
}));
vi.mock("api-calls/world/locations/getAllLocationsForExport", () => ({
  getAllLocationsForExport: mocks.getAllLocationsForExport,
}));
vi.mock("api-calls/world/npcs/_getRef", () => ({
  getNPCCollection: vi.fn(() => "npcs"),
}));
vi.mock("api-calls/world/lore/_getRef", () => ({
  getLoreCollection: vi.fn(() => "lore"),
}));
vi.mock("api-calls/world/locations/_getRef", () => ({
  getLocationCollection: vi.fn(() => "locations"),
}));
vi.mock("services/export/yjsToMarkdown", () => ({
  yjsUpdateToMarkdown: mocks.yjsUpdateToMarkdown,
}));

import { WorldExporter } from "../exportWorld";

describe("WorldExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.query.mockImplementation((collection: string) => `query:${collection}`);
    mocks.where.mockImplementation(
      (field: string, operator: string, value: unknown) =>
        `where:${field}:${operator}:${String(value)}`
    );
    mocks.yjsUpdateToMarkdown.mockImplementation(
      (content: Uint8Array | null) => (content ? `markdown-${content[0]}` : "")
    );
  });

  it("counts the combined world file plus readable entities", async () => {
    mocks.getWorldForExport.mockResolvedValue({
      name: "World",
      settingKey: "starforged",
      ownerIds: ["user-1"],
    });
    mocks.getCountFromServer
      .mockResolvedValueOnce({ data: () => ({ count: 2 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 3 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 4 }) });

    const exporter = new WorldExporter({ worldId: "world-1", userId: "user-1" });

    await expect(exporter.count()).resolves.toBe(10);
  });

  it("exports world entities as name-based JSON with embedded notes", async () => {
    mocks.getWorldForExport.mockResolvedValue({
      name: "World",
      settingKey: "starforged",
      ownerIds: ["user-1"],
      campaignGuides: [],
      newTruths: { truth: { selectedTruthOptionIndex: 1 } },
      worldDescription: new Uint8Array([9]),
    });
    mocks.getAllNPCsForExport.mockResolvedValue([
      {
        id: "npc-2",
        doc: { name: "Rival", sharedWithPlayers: true },
        notes: new Uint8Array([2]),
        gmNotes: new Uint8Array([3]),
        gmProperties: { role: "Guide" },
      },
      {
        id: "npc-1",
        doc: { name: "Rival", sharedWithPlayers: true },
        notes: new Uint8Array([1]),
        gmNotes: null,
        gmProperties: null,
      },
    ]);
    mocks.getAllLoreForExport.mockResolvedValue([
      {
        id: "lore-1",
        doc: { name: "Signal", sharedWithPlayers: true },
        notes: null,
        gmNotes: new Uint8Array([4]),
      },
    ]);
    mocks.getAllLocationsForExport.mockResolvedValue([
      {
        id: "loc-1",
        doc: { name: "Haven", sharedWithPlayers: true },
        notes: new Uint8Array([5]),
        gmNotes: null,
        gmProperties: { fields: { trouble: "Storm" } },
      },
    ]);

    const exporter = new WorldExporter({ worldId: "world-1", userId: "user-1" });
    const files = await collectAsyncIterable(exporter.run());

    expect(files.map((file) => file.path)).toEqual([
      "world.json",
      "npcs/rival.json",
      "npcs/rival-2.json",
      "lore/signal.json",
      "locations/haven.json",
    ]);
    expect(JSON.parse(String(files[0].contents))).toMatchObject({
      id: "world-1",
      name: "World",
      descriptionMarkdown: "markdown-9",
    });
    expect(JSON.parse(String(files[1].contents))).toMatchObject({
      id: "npc-1",
      name: "Rival",
      notesMarkdown: "markdown-1",
      gmNotesMarkdown: "",
    });
    expect(JSON.parse(String(files[2].contents))).toMatchObject({
      id: "npc-2",
      role: "Guide",
      gmNotesMarkdown: "markdown-3",
    });
    expect(JSON.parse(String(files[4].contents))).toMatchObject({
      id: "loc-1",
      fields: { trouble: "Storm" },
      notesMarkdown: "markdown-5",
    });
  });
});
