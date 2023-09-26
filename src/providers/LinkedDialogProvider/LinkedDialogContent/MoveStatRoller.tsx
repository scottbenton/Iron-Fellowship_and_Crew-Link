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

  const companions = useStore((store) =>
    Object.values(store.characters.currentCharacter.assets.assets)
      .filter(
        (asset) =>
          asset.trackValue && asset.id.toLocaleLowerCase().includes("companion")
      )
      .map((asset) => {
        const inputKeys = Object.keys(asset.inputs ?? {});
        const assetInputName =
          inputKeys.length > 0
            ? (asset.inputs ?? {})[inputKeys[0]].trim() || undefined
            : undefined;
        return {
          name:
            assetInputName ??
            asset.customAsset?.Title.Short ??
            assetMap[asset.id]?.Title.Short ??
            "",
          health: asset.trackValue ?? 0,
        };
      })
  );

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
