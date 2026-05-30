import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROLL_TYPE } from "types/DieRolls.type";
import { collectAsyncIterable } from "../../__tests__/testUtils";

const mocks = vi.hoisted(() => ({
  getAllLogsForExport: vi.fn(),
}));

vi.mock("api-calls/game-log/getAllLogsForExport", () => ({
  getAllLogsForExport: mocks.getAllLogsForExport,
}));

import { RollLogExporter } from "../exportRollLog";

describe("RollLogExporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports roll log entries into a single JSON file", async () => {
    mocks.getAllLogsForExport.mockResolvedValue([
      {
        id: "log-1",
          roll: {
            type: ROLL_TYPE.ORACLE_TABLE,
            rollLabel: "Oracle",
          timestamp: "2026-05-30T04:00:00.000Z",
          characterId: "char-1",
          uid: "user-1",
          gmsOnly: false,
          roll: 42,
          result: "A result",
        },
      },
    ]);

    const exporter = new RollLogExporter({ campaignId: "camp-1", isGM: false });
    const files = await collectAsyncIterable(exporter.run());

    expect(mocks.getAllLogsForExport).toHaveBeenCalledWith({
      campaignId: "camp-1",
      characterId: undefined,
      isGM: false,
    });
    expect(files[0].path).toBe("roll-log.json");
    expect(JSON.parse(String(files[0].contents))).toEqual({
      source: "campaign",
      ownerId: "camp-1",
      rolls: [
        {
          logId: "log-1",
          type: ROLL_TYPE.ORACLE_TABLE,
          rollLabel: "Oracle",
          timestamp: "2026-05-30T04:00:00.000Z",
          characterId: "char-1",
          uid: "user-1",
          gmsOnly: false,
          roll: 42,
          result: "A result",
        },
      ],
    });
  });
});
