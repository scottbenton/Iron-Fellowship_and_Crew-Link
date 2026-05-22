import { Box, Typography } from "@mui/material";
import { MobileStatTrack } from "pages/Character/CharacterSheetPage/components/MobileStatTrack";
import { useStore } from "stores/store";
import { momentumTrack } from "data/defaultTracks";

export function CharacterConditionMeters() {
  const conditionMeters = useStore((store) => store.rules.conditionMeters);
  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const updateCampaignConditionMeter = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignConditionMeter
  );
  const updateConditionMeter = (
    conditionMeterKey: string,
    newValue: number
  ) => {
    const conditionMeter = conditionMeters[conditionMeterKey];

    if (conditionMeter.shared && isInCampaign) {
      return updateCampaignConditionMeter(conditionMeterKey, newValue);
    } else {
      return updateCharacterConditionMeter(conditionMeterKey, newValue);
    }
  };
  const updateCharacterConditionMeter = useStore(
    (store) => store.characters.currentCharacter.updateCharacterConditionMeter
  );

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

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const numberOfActiveDebilities = useStore((store) => {
    return Object.values(
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
    ).filter((debility) => debility).length;
  });

  const maxMomentum = momentumTrack.max - numberOfActiveDebilities;
  const momentum = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.momentum ?? 0
  );
  const updateMomentum = (newValue: number) => {
    return updateCharacter({
      momentum: newValue,
    });
  };

  const adds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.adds ?? 0
  );
  const updateAdds = (newValue: number) => {
    return updateCharacter({
      adds: newValue,
    });
  };

  return (
    <Box mt={2}>
      <Typography
        fontFamily={(theme) => theme.fontFamilyTitle}
        variant={"h6"}
        color={"text.secondary"}
      >
        Condition Meters
      </Typography>
      <Box display={"flex"} flexWrap={"wrap"} gap={1}>
        {Object.entries(conditionMeters).map(
          ([conditionMeterKey, conditionMeter]) => (
            <MobileStatTrack
              key={conditionMeterKey}
              label={conditionMeter.label}
              value={getConditionMeterValue(conditionMeterKey)}
              onChange={(newValue) =>
                updateConditionMeter(conditionMeterKey, newValue)
              }
              disableRoll={!conditionMeter.rollable}
              min={conditionMeter.min}
              max={conditionMeter.max}
              smallSize
            />
          )
        )}
        <MobileStatTrack
          label={"Momentum"}
          value={momentum}
          onChange={(newValue) => updateMomentum(newValue)}
          disableRoll={true}
          min={momentumTrack.min}
          max={maxMomentum}
          smallSize
          ignoreAdds={true}
        />
        <MobileStatTrack
          label={"Adds"}
          value={adds}
          onChange={(newValue) => updateAdds(newValue)}
          disableRoll={true}
          min={-9}
          max={9}
          smallSize
        />
      </Box>
    </Box>
  );
}
