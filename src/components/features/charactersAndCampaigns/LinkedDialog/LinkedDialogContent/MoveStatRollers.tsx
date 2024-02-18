import { Box } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { PlayerConditionMeter } from "types/stats.enum";
import { useStore } from "stores/store";
import { MoveStatRoller } from "./MoveStatRoller";
import { assetMap } from "data/assets";
import { LEGACY_TRACK_TYPES, LegacyTrack } from "types/LegacyTrack.type";

export interface MoveStatsProps {
  moveName: string;
  visibleStats: { [key: string]: boolean };
  customMoveStats?: { [label: string]: number };
}

function getLegacyValue(track: LegacyTrack | undefined) {
  if (track) {
    if (track.isLegacy) {
      return 10;
    }
    return Math.floor(track.value / 4);
  }
  return 0;
}

export function MoveStatRollers(props: MoveStatsProps) {
  const { moveName, visibleStats, customMoveStats } = props;

  const stats = useStore((store) => {
    const currentCharacter = store.characters.currentCharacter.currentCharacter;

    if (currentCharacter) {
      const statMap = { ...currentCharacter.stats, ...customMoveStats };
      store.settings.customStats.forEach((customStat) => {
        if (!statMap[customStat]) {
          statMap[customStat] = 0;
        }
      });
      store.settings.customTracks.forEach((customTrack) => {
        if (!statMap[customTrack.label] && customTrack.rollable) {
          const index = (currentCharacter.customTracks ?? {})[
            customTrack.label
          ];
          const value =
            index && typeof customTrack.values[index].value === "number"
              ? customTrack.values[index].value
              : 0;
          statMap[customTrack.label] = value as number;
        }
      });
      statMap[PlayerConditionMeter.Health] = currentCharacter.health;
      statMap[PlayerConditionMeter.Spirit] = currentCharacter.spirit;
      statMap[PlayerConditionMeter.Supply] =
        store.campaigns.currentCampaign.currentCampaign?.supply ??
        currentCharacter.supply;

      return statMap;
    }
    return undefined;
  });

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateCurrentCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const assets = useStore(
    (store) => store.characters.currentCharacter.assets.assets
  );
  const sharedAssets = useStore(
    (store) => store.campaigns.currentCampaign.assets.assets
  );

  const companions: { name: string; health: number }[] = [];
  const vehicles: { name: string; integrity: number }[] = [];
  Object.values({ ...assets, ...sharedAssets }).flatMap((asset) => {
    const actualAsset = asset.customAsset ?? assetMap[asset.id];
    if (
      asset.trackValue &&
      actualAsset?.["Condition meter"]?.Label.toLowerCase() ===
        "companion health"
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
    } else if (
      asset.trackValue &&
      actualAsset?.["Condition meter"]?.Label.toLowerCase() === "integrity"
    ) {
      const inputKeys = Object.keys(asset.inputs ?? {});
      const assetInputName =
        inputKeys.length > 0
          ? (asset.inputs ?? {})[inputKeys[0]].trim() || undefined
          : undefined;
      vehicles.push({
        name: assetInputName ?? actualAsset.Title.Short ?? "",
        integrity: asset.trackValue ?? 0,
      });
    }
  });

  const legacies = useStore((store) => {
    const currentCharacter = store.characters.currentCharacter.currentCharacter;

    if (currentCharacter) {
      return {
        [LEGACY_TRACK_TYPES.BONDS]: getLegacyValue(
          currentCharacter.legacyTracks?.[LEGACY_TRACK_TYPES.BONDS]
        ),
        [LEGACY_TRACK_TYPES.QUESTS]: getLegacyValue(
          currentCharacter.legacyTracks?.[LEGACY_TRACK_TYPES.QUESTS]
        ),
        [LEGACY_TRACK_TYPES.DISCOVERIES]: getLegacyValue(
          currentCharacter.legacyTracks?.[LEGACY_TRACK_TYPES.DISCOVERIES]
        ),
      };
    }
    return {};
  });

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {Object.keys(visibleStats).map(
        (visibleStat) =>
          visibleStats[visibleStat] && (
            <MoveStatRoller
              key={visibleStat}
              stats={stats ?? {}}
              legacies={legacies}
              statName={visibleStat}
              companions={companions}
              vehicles={vehicles}
              moveName={moveName}
            />
          )
      )}

      {stats &&
        Object.keys(visibleStats).filter(
          (statKey) => statKey.toLowerCase() !== "vow progress"
        ).length > 0 && (
          <StatComponent
            label={`Adds`}
            value={adds ?? 0}
            updateTrack={(newValue) =>
              updateCurrentCharacter({ adds: newValue }).catch(() => {})
            }
            sx={{ mb: 1, mr: 1 }}
          />
        )}
    </Box>
  );
}
