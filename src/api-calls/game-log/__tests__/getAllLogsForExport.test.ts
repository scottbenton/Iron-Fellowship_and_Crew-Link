import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  convertFromDatabase: vi.fn(),
  getCampaignGameLogCollection: vi.fn(),
  getCharacterGameLogCollection: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getDocs: mocks.getDocs,
  orderBy: mocks.orderBy,
  query: mocks.query,
  where: mocks.where,
}));
vi.mock("../_getRef", () => ({
  convertFromDatabase: mocks.convertFromDatabase,
  getCampaignGameLogCollection: mocks.getCampaignGameLogCollection,
  getCharacterGameLogCollection: mocks.getCharacterGameLogCollection,
}));

import { getAllLogsForExport } from "../getAllLogsForExport";

describe("getAllLogsForExport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.orderBy.mockImplementation(
      (field: string, direction: string) => `order:${field}:${direction}`
    );
    mocks.where.mockImplementation(
      (field: string, operator: string, value: unknown) =>
        `where:${field}:${operator}:${String(value)}`
    );
    mocks.query.mockImplementation((collection: string, ...constraints: string[]) => ({
      collection,
      constraints,
    }));
    mocks.getCampaignGameLogCollection.mockReturnValue("campaign-logs");
    mocks.getCharacterGameLogCollection.mockReturnValue("character-logs");
    mocks.convertFromDatabase.mockImplementation((doc: unknown) => ({
      converted: doc,
    }));
    mocks.getDocs.mockResolvedValue({
      docs: [{ id: "log-1", data: () => ({ roll: 42 }) }],
    });
  });

  it("reads all GM-visible campaign logs in timestamp order", async () => {
    const logs = await getAllLogsForExport({ campaignId: "camp-1", isGM: true });

    expect(mocks.getCampaignGameLogCollection).toHaveBeenCalledWith("camp-1");
    expect(mocks.query).toHaveBeenCalledWith(
      "campaign-logs",
      "order:timestamp:asc"
    );
    expect(logs).toEqual([{ id: "log-1", roll: { converted: { roll: 42 } } }]);
  });

  it("filters non-GM exports to player-visible logs", async () => {
    await getAllLogsForExport({ characterId: "char-1", isGM: false });

    expect(mocks.getCharacterGameLogCollection).toHaveBeenCalledWith("char-1");
    expect(mocks.query).toHaveBeenCalledWith(
      "character-logs",
      "where:gmsOnly:==:false",
      "order:timestamp:asc"
    );
  });
});
