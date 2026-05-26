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

export interface WorldExporterParams {
  worldId: string;
  userId: string;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExportAbortedError();
}

/**
 * Per-entity file counts:
 *   Non-owners: 1 JSON + 1 notes.md = 2
 *   Owners:     1 JSON (with GM properties merged in) + 1 notes.md + 1 gm-notes.md = 3
 */
function filesPerEntity(isOwner: boolean): number {
  return isOwner ? 3 : 2;
}

/**
 * Determine whether userId is an owner/guide of the world.
 * ownerIds in the decoded World already includes campaignGuides (see decodeWorld).
 */
function resolveOwnership(world: World, userId: string): boolean {
  return world.ownerIds.includes(userId);
}

export function createWorldExporter(params: WorldExporterParams): Exporter {
  const { worldId, userId } = params;

  return {
    stage: "World",

    async count(signal?: AbortSignal): Promise<number> {
      throwIfAborted(signal);

      const world = await getWorldForExport(worldId);
      if (!world) return 0;

      throwIfAborted(signal);

      const isOwner = resolveOwnership(world, userId);

      // world.json + world/description.md + world/truths.json
      let total = 3;

      // Collection counts (filtered by sharedWithPlayers for non-owners)
      const [npcCount, loreCount, locationCount] = await Promise.all([
        getCountFromServer(
          isOwner
            ? getNPCCollection(worldId)
            : query(getNPCCollection(worldId), where("sharedWithPlayers", "==", true))
        ).then((r) => r.data().count),
        getCountFromServer(
          isOwner
            ? getLoreCollection(worldId)
            : query(getLoreCollection(worldId), where("sharedWithPlayers", "==", true))
        ).then((r) => r.data().count),
        getCountFromServer(
          isOwner
            ? getLocationCollection(worldId)
            : query(
                getLocationCollection(worldId),
                where("sharedWithPlayers", "==", true)
              )
        ).then((r) => r.data().count),
      ]);

      throwIfAborted(signal);

      total += npcCount * filesPerEntity(isOwner);
      total += loreCount * filesPerEntity(isOwner);
      total += locationCount * filesPerEntity(isOwner);

      return total;
    },

    async *run(signal?: AbortSignal): AsyncIterable<ExportFile> {
      throwIfAborted(signal);

      const world = await getWorldForExport(worldId);
      if (!world) return;

      throwIfAborted(signal);

      const isOwner = resolveOwnership(world, userId);

      // ------------------------------------------------------------------ //
      // world.json  (worldDescription is the Yjs binary — excluded from JSON)
      // ------------------------------------------------------------------ //
      const worldJson: Omit<World, "worldDescription"> = {
        name: world.name,
        settingKey: world.settingKey,
        ownerIds: world.ownerIds,
        campaignGuides: world.campaignGuides,
        newTruths: world.newTruths,
      };

      yield {
        path: "world.json",
        contents: JSON.stringify(worldJson, null, 2),
      };
      throwIfAborted(signal);

      // ------------------------------------------------------------------ //
      // world/description.md
      // ------------------------------------------------------------------ //
      yield {
        path: "world/description.md",
        contents: yjsUpdateToMarkdown(world.worldDescription ?? null),
      };
      throwIfAborted(signal);

      // ------------------------------------------------------------------ //
      // world/truths.json
      // ------------------------------------------------------------------ //
      yield {
        path: "world/truths.json",
        contents: JSON.stringify(world.newTruths ?? {}, null, 2),
      };
      throwIfAborted(signal);

      // ------------------------------------------------------------------ //
      // Fetch all collections
      // ------------------------------------------------------------------ //
      const [npcs, loreItems, locations] = await Promise.all([
        getAllNPCsForExport(worldId, isOwner),
        getAllLoreForExport(worldId, isOwner),
        getAllLocationsForExport(worldId, isOwner),
      ]);

      throwIfAborted(signal);

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
        yield {
          path: `npcs/${npc.id}.json`,
          contents: JSON.stringify(npcJson, null, 2),
        };
        throwIfAborted(signal);

        yield {
          path: `npcs/${npc.id}/notes.md`,
          contents: yjsUpdateToMarkdown(npc.notes),
        };
        throwIfAborted(signal);

        if (isOwner) {
          yield {
            path: `npcs/${npc.id}/gm-notes.md`,
            contents: yjsUpdateToMarkdown(npc.gmNotes),
          };
          throwIfAborted(signal);
        }
      }

      // ------------------------------------------------------------------ //
      // Lore
      // ------------------------------------------------------------------ //
      for (const lore of loreItems) {
        throwIfAborted(signal);

        yield {
          path: `lore/${lore.id}.json`,
          contents: JSON.stringify(lore.doc, null, 2),
        };
        throwIfAborted(signal);

        yield {
          path: `lore/${lore.id}/notes.md`,
          contents: yjsUpdateToMarkdown(lore.notes),
        };
        throwIfAborted(signal);

        if (isOwner) {
          yield {
            path: `lore/${lore.id}/gm-notes.md`,
            contents: yjsUpdateToMarkdown(lore.gmNotes),
          };
          throwIfAborted(signal);
        }
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
        yield {
          path: `locations/${location.id}.json`,
          contents: JSON.stringify(locationJson, null, 2),
        };
        throwIfAborted(signal);

        yield {
          path: `locations/${location.id}/notes.md`,
          contents: yjsUpdateToMarkdown(location.notes),
        };
        throwIfAborted(signal);

        if (isOwner) {
          yield {
            path: `locations/${location.id}/gm-notes.md`,
            contents: yjsUpdateToMarkdown(location.gmNotes),
          };
          throwIfAborted(signal);
        }
      }
    },
  };
}
