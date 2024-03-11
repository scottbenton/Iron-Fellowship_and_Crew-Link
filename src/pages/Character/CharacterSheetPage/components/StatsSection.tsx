import { Box, Divider } from "@mui/material";
import { StatsMap } from "types/Character.type";

import { Stat } from "types/stats.enum";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";

export function StatsSection() {
  const showNewRules = useNewCustomContentPage();
  const ruleStats = useStore((store) => store.rules.stats);

  // We know character is defined at this point, hence the typecasting
  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  ) as StatsMap;
  const customStats = useStore((store) => store.settings.customStats);

  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const conditionMeters = useStore((store) => store.rules.conditionMeters);
  const characterConditionMeters = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.conditionMeters
  );
  const campaignConditionMeters = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );
  const getConditionMeterValue = (conditionMeterKey: string): number => {
    const conditionMeter = conditionMeters[conditionMeterKey];

    if (conditionMeter.shared && isInCampaign && campaignConditionMeters) {
      return campaignConditionMeters[conditionMeterKey] ?? conditionMeter.value;
    } else if (
      (!conditionMeter.shared || !isInCampaign) &&
      characterConditionMeters
    ) {
      return (
        characterConditionMeters[conditionMeterKey] ?? conditionMeter.value
      );
    }

    return conditionMeter.value;
  };

  const health = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.health
  ) as number;
  const spirit = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.spirit
  ) as number;

  const supply = useStore(
    (store) =>
      (store.characters.currentCharacter.currentCharacter?.campaignId
        ? store.campaigns.currentCampaign.currentCampaign?.supply
        : store.characters.currentCharacter.currentCharacter?.supply) ?? 5
  );

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateAdds = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const customTracks = useStore((store) =>
    store.settings.customTracks.filter((track) => track.rollable)
  );
  const customTrackValues = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.customTracks ?? {}
  );

  return (
    <Box display={"flex"} flexWrap={"wrap"} justifyContent={"flex-start"}>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
        {showNewRules ? (
          <>
            {Object.keys(ruleStats).map((statKey, index, arr) => (
              <StatComponent
                key={statKey}
                label={ruleStats[statKey].label}
                value={stats[statKey] ?? 0}
                sx={{ my: 0.5, mr: index === arr.length - 1 ? 0 : 0.5 }}
              />
            ))}
          </>
        ) : (
          <>
            <StatComponent
              label={"Edge"}
              value={stats[Stat.Edge]}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Heart"}
              value={stats[Stat.Heart]}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Iron"}
              value={stats[Stat.Iron]}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Shadow"}
              value={stats[Stat.Shadow]}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Wits"}
              value={stats[Stat.Wits]}
              sx={{ my: 0.5, mr: customStats.length > 0 ? 0.5 : 0 }}
            />
            {customStats.map((customStat, index) => (
              <StatComponent
                key={customStat}
                label={customStat}
                value={stats[customStat] ?? 0}
                sx={{ my: 0.5, mr: customStats.length - 1 === index ? 0 : 0.5 }}
              />
            ))}
          </>
        )}
      </Box>
      <Divider
        orientation='vertical'
        flexItem
        sx={(theme) => ({
          mx: 1,
          borderColor:
            theme.palette.grey[theme.palette.mode === "light" ? 700 : 600],
        })}
      />
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
        {showNewRules ? (
          <>
            {Object.keys(conditionMeters)
              .filter(
                (conditionMeterKey) =>
                  conditionMeters[conditionMeterKey].rollable
              )
              .map((conditionMeterKey) => (
                <StatComponent
                  key={conditionMeterKey}
                  label={conditionMeters[conditionMeterKey].label}
                  value={getConditionMeterValue(conditionMeterKey)}
                  sx={{ my: 0.5, mr: 0.5 }}
                />
              ))}
          </>
        ) : (
          <>
            <StatComponent
              label={"Health"}
              value={health}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Spirit"}
              value={spirit}
              sx={{ my: 0.5, mr: 0.5 }}
            />
            <StatComponent
              label={"Supply"}
              value={supply}
              sx={{ my: 0.5, mr: customTracks.length > 0 ? 0.5 : 0 }}
            />

            {customTracks.map((track, index) => (
              <StatComponent
                key={track.label}
                label={track.label}
                value={
                  customTrackValues[track.label] !== undefined &&
                  customTrackValues[track.label] !== null &&
                  typeof track.values[customTrackValues[track.label]].value ===
                    "number"
                    ? (track.values[customTrackValues[track.label]]
                        .value as number)
                    : 0
                }
                sx={{
                  my: 0.5,
                  mr: customTracks.length - 1 === index ? 0 : 0.5,
                }}
              />
            ))}
          </>
        )}
        <Divider
          orientation='vertical'
          flexItem
          sx={(theme) => ({
            mx: 1,
            borderColor:
              theme.palette.grey[theme.palette.mode === "light" ? 700 : 600],
          })}
        />

        <StatComponent
          label={"Adds"}
          updateTrack={(newValue) => updateAdds({ adds: newValue })}
          value={adds}
          sx={{ my: 0.5 }}
        />
      </Box>
    </Box>
  );
}
