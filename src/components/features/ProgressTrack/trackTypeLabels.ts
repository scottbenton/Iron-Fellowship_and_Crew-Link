import { TrackSectionTracks, TrackTypes } from "types/Track.type";

export interface TrackTypeAvailability {
  isDelveEnabled: boolean;
  isIronsworn: boolean;
  isLodestarEnabled: boolean;
  isStarforged: boolean;
}

export function getTrackTypeLabel(
  trackType: TrackSectionTracks,
  isStarforged: boolean
): string {
  switch (trackType) {
    case TrackTypes.Fray:
      return "Combat Track";
    case TrackTypes.Vow:
      return "Vow";
    case TrackTypes.Journey:
      return isStarforged ? "Expedition" : "Journey";
    case TrackTypes.DelveSite:
      return "Delve Site";
    case TrackTypes.SceneChallenge:
      return "Scene Challenge";
    case TrackTypes.Clock:
      return "Clock";
  }
}

export function getAvailableTrackTypes(
  availability: TrackTypeAvailability
): TrackSectionTracks[] {
  const { isDelveEnabled, isIronsworn, isLodestarEnabled, isStarforged } =
    availability;

  const trackTypes: TrackSectionTracks[] = [
    TrackTypes.Vow,
    TrackTypes.Fray,
    TrackTypes.Journey,
  ];

  if (isIronsworn && isDelveEnabled) {
    trackTypes.push(TrackTypes.DelveSite);
  }
  if (isStarforged || (isIronsworn && isLodestarEnabled)) {
    trackTypes.push(TrackTypes.SceneChallenge);
  }

  trackTypes.push(TrackTypes.Clock);

  return trackTypes;
}
