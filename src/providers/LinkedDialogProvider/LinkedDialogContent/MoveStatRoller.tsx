import { Chip } from "@mui/material";
import { StatComponent } from "components/StatComponent";
import { assetMap } from "data/assets";
import { useStore } from "stores/store";

export interface MoveStatRollerProps {
  stats: { [key: string]: number };
  statName: string;
}

export function MoveStatRoller(props: MoveStatRollerProps) {
  const { stats, statName } = props;

  const { companions } = useStore((store) => {
    const companions: { name: string; health: number }[] = [];
    Object.values(store.characters.currentCharacter.assets.assets).flatMap(
      (asset) => {
        const actualAsset = asset.customAsset ?? assetMap[asset.id];
        if (
          asset.trackValue &&
          actualAsset?.["Condition meter"]?.Label === "companion health"
        ) {
          const inputKeys = Object.keys(asset.inputs ?? {});
          const assetInputName =
            inputKeys.length > 0
              ? (asset.inputs ?? {})[inputKeys[0]].trim() || undefined
              : undefined;
          companions.push({
            name: assetInputName ?? actualAsset.Title.Short ?? "",
            health: asset.trackValue ?? 0,
          });
        }
      }
    );
    return { companions };
  });

  if (stats[statName] !== undefined) {
    return (
      <StatComponent
        label={statName}
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
            label={`${companion.name}'s Health`}
            value={companion.health}
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
