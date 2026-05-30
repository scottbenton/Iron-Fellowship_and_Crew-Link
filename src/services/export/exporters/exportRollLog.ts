import { getAllLogsForExport } from "api-calls/game-log/getAllLogsForExport";
import { Exporter, ExportFile } from "services/export/types";
import { ExportAbortedError } from "services/export/zipBundle";

export interface RollLogExporterParams {
  campaignId?: string;
  characterId?: string;
  isGM: boolean;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExportAbortedError();
}

export class RollLogExporter implements Exporter {
  readonly stage = "Roll Log";

  private readonly campaignId?: string;

  private readonly characterId?: string;

  private readonly isGM: boolean;

  constructor(params: RollLogExporterParams) {
    this.campaignId = params.campaignId;
    this.characterId = params.characterId;
    this.isGM = params.isGM;
  }

  async count(signal?: AbortSignal): Promise<number> {
    throwIfAborted(signal);
    return 1;
  }

  async *run(signal?: AbortSignal): AsyncIterable<ExportFile> {
    throwIfAborted(signal);

    const records = await getAllLogsForExport({
      campaignId: this.campaignId,
      characterId: this.characterId,
      isGM: this.isGM,
    });

    throwIfAborted(signal);

    yield {
      path: "roll-log.json",
      contents: JSON.stringify(
        {
          source: this.campaignId ? "campaign" : "character",
          ownerId: this.campaignId ?? this.characterId,
          rolls: records.map((record) => ({
            logId: record.id,
            ...record.roll,
          })),
        },
        null,
        2
      ),
    };
  }
}
