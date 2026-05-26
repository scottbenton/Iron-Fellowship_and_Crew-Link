import { getDocs } from "firebase/firestore";
import { getCharacterForExport } from "api-calls/character/getCharacterForExport";
import { getCharacterAssetCollection } from "api-calls/assets/_getRef";
import {
  convertFromDatabase,
  getCharacterTracksCollection,
} from "api-calls/tracks/_getRef";
import { ExportAbortedError } from "services/export/zipBundle";
import type { Exporter, ExportFile } from "services/export/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ExportAbortedError();
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

export interface CharacterExporterParams {
  characterId: string;
}

/**
 * Produces a zip sub-tree for a single character:
 *
 *   characters/<characterId>/character.json
 *   characters/<characterId>/tracks.json   (when tracks exist)
 *   characters/<characterId>/assets.json   (when assets exist)
 *
 * The profile-image *binary* is never included; only the filename string
 * already present on the character document is kept.
 *
 * Character Notes (from the /notes Firestore collection) are NOT exported
 * here — they belong to a separate exporter.
 *
 * Access check: the character's `uid` field must match `userId`. Characters
 * are owned resources and are not granularly shared, so a mismatch is a
 * hard failure.
 */
export function createCharacterExporter(
  params: CharacterExporterParams
): Exporter {
  const { characterId } = params;
  const base = `characters/${characterId}`;

  // -------------------------------------------------------------------------
  // count()
  // -------------------------------------------------------------------------
  const count = async (signal?: AbortSignal): Promise<number> => {
    throwIfAborted(signal);

    const result = await getCharacterForExport(characterId);
    throwIfAborted(signal);

    if (!result) {
      throw new Error(`Character ${characterId} not found.`);
    }

    // character.json is always emitted; tracks/assets are conditional on
    // whether there is data. We do a lightweight getDocs for count accuracy.
    const [tracksSnap, assetsSnap] = await Promise.all([
      getDocs(getCharacterTracksCollection(characterId)),
      getDocs(getCharacterAssetCollection(characterId)),
    ]);
    throwIfAborted(signal);

    let fileCount = 1; // character.json
    if (!tracksSnap.empty) fileCount += 1; // tracks.json
    if (!assetsSnap.empty) fileCount += 1; // assets.json

    return fileCount;
  };

  // -------------------------------------------------------------------------
  // run()
  // -------------------------------------------------------------------------
  async function* run(signal?: AbortSignal): AsyncIterable<ExportFile> {
    throwIfAborted(signal);

    const result = await getCharacterForExport(characterId);
    throwIfAborted(signal);

    if (!result) {
      throw new Error(`Character ${characterId} not found.`);
    }

    const { data: doc } = result;

    // -- character.json -------------------------------------------------------
    // Omit the binary image; keep just the filename string for reference.
    const characterJson: Record<string, unknown> = {
      uid: doc.uid,
      name: doc.name,
      stats: doc.stats,
      momentum: doc.momentum,
    };

    if (doc.campaignId != null) characterJson.campaignId = doc.campaignId;
    if (doc.worldId != null) characterJson.worldId = doc.worldId;
    if (doc.conditionMeters != null)
      characterJson.conditionMeters = doc.conditionMeters;
    if (doc.initiativeStatus != null)
      characterJson.initiativeStatus = doc.initiativeStatus;
    if (doc.specialTracks != null)
      characterJson.specialTracks = doc.specialTracks;
    if (doc.experience != null) characterJson.experience = doc.experience;
    if (doc.debilities != null) characterJson.debilities = doc.debilities;
    if (doc.adds != null) characterJson.adds = doc.adds;
    if (doc.customTracks != null) characterJson.customTracks = doc.customTracks;
    if (doc.expansionIds != null) characterJson.expansionIds = doc.expansionIds;
    if (doc.theme != null) characterJson.theme = doc.theme;

    // Keep only the filename string, not the position/scale metadata, to
    // make it clear no binary was included.
    if (doc.profileImage?.filename) {
      characterJson.profileImageFilename = doc.profileImage.filename;
    }

    yield {
      path: `${base}/character.json`,
      contents: JSON.stringify(characterJson, null, 2),
    };
    throwIfAborted(signal);

    // -- tracks.json ----------------------------------------------------------
    const tracksSnap = await getDocs(getCharacterTracksCollection(characterId));
    throwIfAborted(signal);

    if (!tracksSnap.empty) {
      const tracks: Record<string, unknown> = {};
      tracksSnap.docs.forEach((d) => {
        tracks[d.id] = convertFromDatabase(d.data());
      });
      yield {
        path: `${base}/tracks.json`,
        contents: JSON.stringify(tracks, null, 2),
      };
      throwIfAborted(signal);
    }

    // -- assets.json ----------------------------------------------------------
    const assetsSnap = await getDocs(getCharacterAssetCollection(characterId));
    throwIfAborted(signal);

    if (!assetsSnap.empty) {
      const assets: Record<string, unknown> = {};
      assetsSnap.docs.forEach((d) => {
        assets[d.id] = d.data();
      });
      yield {
        path: `${base}/assets.json`,
        contents: JSON.stringify(assets, null, 2),
      };
      throwIfAborted(signal);
    }
  }

  // -------------------------------------------------------------------------
  // Exporter object
  // -------------------------------------------------------------------------
  return {
    stage: "Character",
    count,
    run,
  };
}
