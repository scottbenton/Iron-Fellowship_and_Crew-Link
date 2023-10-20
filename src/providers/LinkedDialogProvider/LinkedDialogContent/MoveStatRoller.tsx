import { Chip } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { assetMap } from "data/assets";
import { useStore } from "stores/store";

export interface MoveStatRollerProps {
  stats: { [key: string]: number };
  companions: { health: number; name: string }[];
  vehicles: { integrity: number; name: string }[];
  statName: string;
  moveName: string;
}

export function MoveStatRoller(props: MoveStatRollerProps) {
  const { stats, statName, moveName, companions, vehicles } = props;

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

  if (statName === "companion health" && Object.keys(stats).length > 0) {
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

  if (statName === "vehicle integrity" && Object.keys(stats).length > 0) {
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

  return (
    <Chip label={statName} sx={{ textTransform: "capitalize", mb: 1, mr: 1 }} />
  );
}
