import { Grid } from "@mui/material";
import {
  deleteField,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ProgressTrackList } from "../../../components/ProgressTrackList";
import { firebaseAuth } from "../../../config/firebase.config";
import { getSharedCampaignTracksCollection } from "../../../lib/firebase.lib";
import { StoredTrack, TRACK_TYPES } from "../../../types/Track.type";
import {
  convertTrackMapToArray,
  TrackWithId,
} from "../../character-sheet/characterSheet.store";

export interface CampaignProgressTracksProps {
  campaignId: string;
}

export function CampaignProgressTracks(props: CampaignProgressTracksProps) {
  const { campaignId } = props;

  const [vows, setVows] = useState<TrackWithId[]>();
  const [frays, setFrays] = useState<TrackWithId[]>();
  const [journeys, setJourneys] = useState<TrackWithId[]>();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    const uid = firebaseAuth.currentUser?.uid;

    if (campaignId && uid) {
      unsubscribe = onSnapshot(
        getSharedCampaignTracksCollection(campaignId),
        (snapshot) => {
          const data = snapshot.data();

          setVows(convertTrackMapToArray(data?.[TRACK_TYPES.VOW] ?? {}));
          setJourneys(
            convertTrackMapToArray(data?.[TRACK_TYPES.JOURNEY] ?? {})
          );
          setFrays(convertTrackMapToArray(data?.[TRACK_TYPES.FRAY] ?? {}));
        }
      );
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId]);

  const addProgressTrack = (type: TRACK_TYPES, track: StoredTrack) => {
    return new Promise<boolean>((resolve, reject) => {
      const uid = firebaseAuth.currentUser?.uid;

      if (!uid) {
        reject("No user found");
        return;
      }
      if (!campaignId) {
        reject("No campaign found");
        return;
      }

      setDoc(
        getSharedCampaignTracksCollection(campaignId ?? ""),
        {
          [type]: {
            [track.label + track.createdTimestamp.toString()]: track,
          },
        },
        { merge: true }
      )
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to add shared progress track");
        });
    });
  };

  const updateProgressTrackValue = (
    type: TRACK_TYPES,
    id: string,
    value: number
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      const uid = firebaseAuth.currentUser?.uid;

      if (!uid) {
        reject("No user found");
        return;
      }
      if (!campaignId) {
        reject("No campaign found");
        return;
      }

      updateDoc(
        getSharedCampaignTracksCollection(campaignId ?? ""),
        //@ts-ignore
        {
          [`${type}.${id}.value`]: value,
        }
      )
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update progress track");
        });
    });
  };

  const removeProgressTrack = (type: TRACK_TYPES, id: string) => {
    return new Promise<boolean>((resolve, reject) => {
      const uid = firebaseAuth.currentUser?.uid;

      if (!uid) {
        reject("No user found");
        return;
      }
      if (!campaignId) {
        reject("No campaign found");
        return;
      }

      updateDoc(
        getSharedCampaignTracksCollection(campaignId ?? ""), //@ts-ignore
        {
          [`${type}.${id}`]: deleteField(),
        }
      )
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to remove progress track");
        });
    });
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <ProgressTrackList
          tracks={vows}
          typeLabel={"Shared Vow"}
          handleAdd={(newTrack) => addProgressTrack(TRACK_TYPES.VOW, newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(TRACK_TYPES.VOW, trackId, value)
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack(TRACK_TYPES.VOW, trackId)
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProgressTrackList
          tracks={frays}
          typeLabel={"Shared Combat Track"}
          handleAdd={(newTrack) => addProgressTrack(TRACK_TYPES.FRAY, newTrack)}
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(TRACK_TYPES.FRAY, trackId, value)
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack(TRACK_TYPES.FRAY, trackId)
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProgressTrackList
          tracks={journeys}
          typeLabel={"Shared Journey"}
          handleAdd={(newTrack) =>
            addProgressTrack(TRACK_TYPES.JOURNEY, newTrack)
          }
          handleUpdateValue={(trackId, value) =>
            updateProgressTrackValue(TRACK_TYPES.JOURNEY, trackId, value)
          }
          handleDeleteTrack={(trackId) =>
            removeProgressTrack(TRACK_TYPES.JOURNEY, trackId)
          }
        />
      </Grid>
    </>
  );
}
