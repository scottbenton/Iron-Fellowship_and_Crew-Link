import { Container, Grid, Stack } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { Track } from "components/features/Track";
import { UnifiedTracksSection } from "components/features/ProgressTrack";
import { useStore } from "stores/store";

export function TracksTab() {
  const conditionMeterRules = useStore((store) => store.rules.conditionMeters);
  const conditionMeterValues = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );
  const updateCampaignConditionMeter = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignConditionMeter
  );

  return (
    <Stack spacing={2} sx={{ pb: 2 }}>
      <SectionHeading label={"Shared Condition Meters"} />
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          {Object.keys(conditionMeterRules)
            .filter((cm) => conditionMeterRules[cm].shared)
            .map((cm) => (
              <Grid key={cm} item xs={12} sm={6} lg={4}>
                <Track
                  min={conditionMeterRules[cm].min}
                  max={conditionMeterRules[cm].max}
                  value={
                    conditionMeterValues?.[cm] ?? conditionMeterRules[cm].value
                  }
                  label={conditionMeterRules[cm].label}
                  onChange={(newValue) =>
                    updateCampaignConditionMeter(cm, newValue).catch(() => {})
                  }
                />
              </Grid>
            ))}
        </Grid>
      </Container>

      <UnifiedTracksSection mode={"campaign"} />
    </Stack>
  );
}
