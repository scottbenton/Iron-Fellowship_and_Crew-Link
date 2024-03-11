import { Datasworn } from "@datasworn/core";
import { Chip, Stack } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { useStore } from "stores/store";

export interface MoveRollersProps {
  move: Datasworn.Move;
}

export function MoveRollers(props: MoveRollersProps) {
  const { move } = props;

  const statRules = useStore((store) => store.rules.stats);
  const conditionMeterRules = useStore((store) => store.rules.conditionMeters);

  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const characterStats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  );
  const characterConditionMeters = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.conditionMeters
  );
  const campaignConditionMeters = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );

  const getConditionMeterValue = (conditionMeterKey: string): number => {
    const conditionMeter = conditionMeterRules[conditionMeterKey];

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

  if (move.roll_type === "action_roll") {
    const stats: Record<string, boolean> = {};
    const conditionMeters: Record<string, boolean> = {};
    const assetControls: Record<string, boolean> = {};

    move.trigger.conditions.forEach((trigger) => {
      trigger.roll_options.forEach((option) => {
        if (option.using === "stat") {
          stats[option.stat] = true;
        } else if (option.using === "condition_meter") {
          conditionMeters[option.condition_meter] = true;
        } else if (option.using === "asset_control") {
          assetControls[option.control] = true;
        }
      });
    });
    return (
      <Stack spacing={0.5} direction={"row"} flexWrap={"wrap"} sx={{ mt: 0.5 }}>
        {Object.keys(statRules)
          .filter((stat) => stats[stat])
          .map((stat) =>
            characterStats ? (
              <StatComponent
                key={stat}
                label={statRules[stat].label}
                value={characterStats[stat]}
                moveName={move.name}
              />
            ) : (
              <Chip
                key={stat}
                label={stat}
                sx={{ textTransform: "capitalize" }}
              />
            )
          )}
        {Object.keys(conditionMeterRules)
          .filter((cm) => conditionMeters[cm])
          .map((conditionMeterKey) =>
            characterConditionMeters ? (
              <StatComponent
                key={conditionMeterKey}
                label={conditionMeterRules[conditionMeterKey].label}
                value={getConditionMeterValue(conditionMeterKey)}
                moveName={move.name}
              />
            ) : (
              <Chip
                key={conditionMeterKey}
                label={conditionMeterRules[conditionMeterKey].label}
                sx={{ textTransform: "capitalize" }}
              />
            )
          )}
        {Object.keys(assetControls).map((assetControl) => (
          <Chip
            key={assetControl}
            label={assetControl}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>
    );
  } else if (move.roll_type === "progress_roll") {
    const trackCategory = move.tracks.category;
    return <Chip label={trackCategory} sx={{ textTransform: "capitalize" }} />;
  } else if (move.roll_type === "special_track") {
    const specialTracks: string[] = [];
    move.trigger.conditions.forEach((condition) => {
      condition.roll_options.forEach((option) =>
        specialTracks.push(option.using)
      );
    });

    return (
      <Stack spacing={0.5} direction={"row"} flexWrap={"wrap"}>
        {specialTracks.map((specialTrack) => (
          <Chip
            key={specialTrack}
            label={specialTrack}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>
    );
  }

  return <></>;
}
