import { getCountFromServer, query, where } from "firebase/firestore";
import { Exporter, ExportFile } from "services/export/types";
import { ExportAbortedError } from "services/export/zipBundle";
import { yjsUpdateToMarkdown } from "services/export/yjsToMarkdown";
import { getWorldForExport } from "api-calls/world/getWorldForExport";
import { getAllNPCsForExport } from "api-calls/world/npcs/getAllNPCsForExport";
import { getAllLoreForExport } from "api-calls/world/lore/getAllLoreForExport";
import { getAllLocationsForExport } from "api-calls/world/locations/getAllLocationsForExport";
import { getNPCCollection } from "api-calls/world/npcs/_getRef";
import { getLoreCollection } from "api-calls/world/lore/_getRef";
import { getLocationCollection } from "api-calls/world/locations/_getRef";
import { World } from "api-calls/world/_world.type";
import {
  buildUniqueExportPath,
  createExportFilenameTracker,
} from "services/export/exportFilename";

export interface WorldExporterParams {
  worldId: string;
  userId: string;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExportAbortedError();
}

/**
 * Determine whether userId is an owner/guide of the world.
 * ownerIds in the decoded World already includes campaignGuides (see decodeWorld).
 */
function resolveOwnership(world: World, userId: string): boolean {
  return world.ownerIds.includes(userId);
}

function compareNamedExportRecords(
  a: { id: string; doc: { name: string } },
  b: { id: string; doc: { name: string } }
): number {
  const nameCompare = a.doc.name.localeCompare(b.doc.name);
  if (nameCompare !== 0) return nameCompare;
  return a.id.localeCompare(b.id);
}

export class WorldExporter implements Exporter {
  readonly stage = "World";

  private readonly worldId: string;

  private readonly userId: string;

  constructor(params: WorldExporterParams) {
    this.worldId = params.worldId;
    this.userId = params.userId;
  }

  async count(signal?: AbortSignal): Promise<number> {
    throwIfAborted(signal);

    const world = await getWorldForExport(this.worldId);
    if (!world) return 0;

    throwIfAborted(signal);

    const isOwner = resolveOwnership(world, this.userId);

    // world.json
    let total = 1;

    // Collection counts (filtered by sharedWithPlayers for non-owners)
    const [npcCount, loreCount, locationCount] = await Promise.all([
      getCountFromServer(
        isOwner
          ? getNPCCollection(this.worldId)
          : query(
              getNPCCollection(this.worldId),
              where("sharedWithPlayers", "==", true)
            )
      ).then((r) => r.data().count),
      getCountFromServer(
        isOwner
          ? getLoreCollection(this.worldId)
          : query(
              getLoreCollection(this.worldId),
              where("sharedWithPlayers", "==", true)
            )
      ).then((r) => r.data().count),
      getCountFromServer(
        isOwner
          ? getLocationCollection(this.worldId)
          : query(
              getLocationCollection(this.worldId),
              where("sharedWithPlayers", "==", true)
            )
      ).then((r) => r.data().count),
    ]);

    throwIfAborted(signal);

    total += npcCount;
    total += loreCount;
    total += locationCount;

    return total;
  }

  async *run(signal?: AbortSignal): AsyncIterable<ExportFile> {
    throwIfAborted(signal);

    const world = await getWorldForExport(this.worldId);
    if (!world) return;

    throwIfAborted(signal);

    const isOwner = resolveOwnership(world, this.userId);

    const worldJson: Omit<World, "worldDescription"> & {
      descriptionMarkdown: string;
    } = {
      name: world.name,
      settingKey: world.settingKey,
      ownerIds: world.ownerIds,
      campaignGuides: world.campaignGuides,
      newTruths: world.newTruths,
      descriptionMarkdown: yjsUpdateToMarkdown(world.worldDescription ?? null),
    };

    yield {
      path: "world.json",
      contents: JSON.stringify(worldJson, null, 2),
    };
    throwIfAborted(signal);

    // ------------------------------------------------------------------ //
    // Fetch all collections
    // ------------------------------------------------------------------ //
    const [npcs, loreItems, locations] = await Promise.all([
      getAllNPCsForExport(this.worldId, isOwner),
      getAllLoreForExport(this.worldId, isOwner),
      getAllLocationsForExport(this.worldId, isOwner),
    ]);

    throwIfAborted(signal);
    const npcPaths = createExportFilenameTracker();
    const lorePaths = createExportFilenameTracker();
    const locationPaths = createExportFilenameTracker();
    npcs.sort(compareNamedExportRecords);
    loreItems.sort(compareNamedExportRecords);
    locations.sort(compareNamedExportRecords);

    // ------------------------------------------------------------------ //
    // NPCs
    // ------------------------------------------------------------------ //
    for (const npc of npcs) {
      throwIfAborted(signal);

      // For owners, merge GM properties (role, goal, descriptor, etc.) into
      // the base NPC JSON. Image bytes are not included; image filenames
      // already live on npc.doc as strings.
      const npcJson =
        isOwner && npc.gmProperties
          ? { ...npc.doc, ...npc.gmProperties }
          : npc.doc;
      const path = buildUniqueExportPath({
        directory: "npcs",
        name: npc.doc.name,
        fallbackId: npc.id,
        extension: "json",
        tracker: npcPaths,
      });
      yield {
        path,
        contents: JSON.stringify(
          {
            ...npcJson,
            notesMarkdown: yjsUpdateToMarkdown(npc.notes),
            ...(isOwner
              ? { gmNotesMarkdown: yjsUpdateToMarkdown(npc.gmNotes) }
              : {}),
          },
          null,
          2
        ),
      };
      throwIfAborted(signal);
    }

    // ------------------------------------------------------------------ //
    // Lore
    // ------------------------------------------------------------------ //
    for (const lore of loreItems) {
      throwIfAborted(signal);

      const path = buildUniqueExportPath({
        directory: "lore",
        name: lore.doc.name,
        fallbackId: lore.id,
        extension: "json",
        tracker: lorePaths,
      });
      yield {
        path,
        contents: JSON.stringify(
          {
            ...lore.doc,
            notesMarkdown: yjsUpdateToMarkdown(lore.notes),
            ...(isOwner
              ? { gmNotesMarkdown: yjsUpdateToMarkdown(lore.gmNotes) }
              : {}),
          },
          null,
          2
        ),
      };
      throwIfAborted(signal);
    }

    // ------------------------------------------------------------------ //
    // Locations
    // ------------------------------------------------------------------ //
    for (const location of locations) {
      throwIfAborted(signal);

      const locationJson =
        isOwner && location.gmProperties
          ? { ...location.doc, ...location.gmProperties }
          : location.doc;
      const path = buildUniqueExportPath({
        directory: "locations",
        name: location.doc.name,
        fallbackId: location.id,
        extension: "json",
        tracker: locationPaths,
      });
      yield {
        path,
        contents: JSON.stringify(
          {
            ...locationJson,
            notesMarkdown: yjsUpdateToMarkdown(location.notes),
            ...(isOwner
              ? { gmNotesMarkdown: yjsUpdateToMarkdown(location.gmNotes) }
              : {}),
          },
          null,
          2
        ),
      };
      throwIfAborted(signal);
    }
  }
}
