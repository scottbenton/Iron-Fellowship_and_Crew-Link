import { Button, Chip } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { useRoller } from "stores/appState/useRoller";
import { LEGACY_TRACK_TYPES } from "types/LegacyTrack.type";

export interface MoveStatRollerProps {
  stats: { [key: string]: number };
  companions: { health: number; name: string }[];
  vehicles: { integrity: number; name: string }[];
  legacies: { [key in LEGACY_TRACK_TYPES]?: number };
  statName: string;
  moveName: string;
}

export function MoveStatRoller(props: MoveStatRollerProps) {
  const { stats, legacies, statName, moveName, companions, vehicles } = props;

  const { rollTrackProgress } = useRoller();

  if (stats[statName] !== undefined) {
    return (
      <StatComponent
        label={statName}
        moveName={moveName}
        value={stats[statName]}
        sx={{ mb: 1, mr: 1 }}
      />
    );
  }

  if (
    statName.toLowerCase() === "companion health" &&
    Object.keys(stats).length > 0
  ) {
    return (
      <>
        {companions.map((companion, index) => (
          <StatComponent
            key={index}
            moveName={moveName}
            label={`${companion.name}'s Health`}
            value={companion.health}
            sx={{ mb: 1, mr: 1 }}
          />
        ))}
      </>
    );
  }

  if (
    (statName.toLowerCase() === "vehicle integrity" ||
      statName.toLowerCase() === "integrity") &&
    Object.keys(stats).length > 0
  ) {
    return (
      <>
        {vehicles.map((vehicle, index) => (
          <StatComponent
            key={index}
            moveName={moveName}
            label={`${vehicle.name}'s Integrity`}
            value={vehicle.integrity}
            sx={{ mb: 1, mr: 1 }}
          />
        ))}
      </>
    );
  }

  if (
    statName.toLowerCase() === "quests legacy" &&
    legacies[LEGACY_TRACK_TYPES.QUESTS] !== undefined
  ) {
    return (
      <div>
        <Button
          onClick={() =>
            rollTrackProgress(
              LEGACY_TRACK_TYPES.QUESTS,
              "Quests Legacy",
              legacies[LEGACY_TRACK_TYPES.QUESTS] ?? 0
            )
          }
          color={"inherit"}
          variant={"outlined"}
          sx={{ mb: 1, mr: 1 }}
        >
          Roll Quests Legacy
        </Button>
      </div>
    );
  }

  if (
    statName.toLowerCase() === "bonds legacy" &&
    legacies[LEGACY_TRACK_TYPES.BONDS] !== undefined
  ) {
    return (
      <div>
        <Button
          onClick={() =>
            rollTrackProgress(
              LEGACY_TRACK_TYPES.BONDS,
              "Bonds Legacy",
              legacies[LEGACY_TRACK_TYPES.BONDS] ?? 0
            )
          }
          color={"inherit"}
          variant={"outlined"}
          sx={{ mb: 1, mr: 1 }}
        >
          Roll Bonds Legacy
        </Button>
      </div>
    );
  }

  if (
    statName === "discoveries legacy" &&
    legacies[LEGACY_TRACK_TYPES.DISCOVERIES] !== undefined
  ) {
    return (
      <div>
        <Button
          onClick={() =>
            rollTrackProgress(
              LEGACY_TRACK_TYPES.DISCOVERIES,
              "Discoveries Legacy",
              legacies[LEGACY_TRACK_TYPES.DISCOVERIES] ?? 0
            )
          }
          color={"inherit"}
          variant={"outlined"}
          sx={{ mb: 1, mr: 1 }}
        >
          Roll Discoveries Legacy
        </Button>
      </div>
    );
  }

  return (
    <Chip label={statName} sx={{ textTransform: "capitalize", mb: 1, mr: 1 }} />
  );
}
