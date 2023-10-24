import { ProgressTrack } from "components/features/ProgressTrack";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useState } from "react";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import {
  DIFFICULTY,
  ProgressTrack as IProgressTrack,
  TRACK_STATUS,
  TRACK_TYPES,
} from "types/Track.type";
import { TryItOut } from "./TryItOut";

export function ExampleTrackSection() {
  const trackDetails = useGameSystemValue<Omit<IProgressTrack, "value">>({
    [GAME_SYSTEMS.IRONSWORN]: {
      label: "Protect Kingsmark",
      description:
        "Serve Jarl Redflame to keep Kingsmark stable and safe from the forces that seek to overthrow him",
      difficulty: DIFFICULTY.FORMIDABLE,
      type: TRACK_TYPES.VOW,
      status: TRACK_STATUS.ACTIVE,
      createdDate: new Date(),
    },
    [GAME_SYSTEMS.STARFORGED]: {
      label: "Find the missing Exodus Ship",
      description:
        "Find The Rebirth, the Exodus ship that recently vanished from the Forge.",
      difficulty: DIFFICULTY.FORMIDABLE,
      type: TRACK_TYPES.VOW,
      status: TRACK_STATUS.ACTIVE,
      createdDate: new Date(),
    },
  });

  const [trackValue, setTrackValue] = useState(28);

  return (
    <TryItOut>
      <ProgressTrack
        max={40}
        value={trackValue}
        label={trackDetails.label}
        description={trackDetails.description}
        difficulty={trackDetails.difficulty}
        trackType={TRACK_TYPES.VOW}
        onValueChange={(value) => {
          setTrackValue(value);
        }}
      />
    </TryItOut>
  );
}
