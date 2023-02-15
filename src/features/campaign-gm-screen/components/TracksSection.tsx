import { Stack } from "@mui/material";
import { useUpdateCampaignSupply } from "api/campaign/updateCampaignSupply";
import { SectionHeading } from "components/SectionHeading";
import { supplyTrack } from "data/defaultTracks";
import { CampaignProgressTracks } from "features/campaign-sheet/components/CampaignProgressTracks";
import { Track } from "components/Track";

export interface TracksSectionProps {
  campaignId: string;
  supply: number;
}
export function TracksSection(props: TracksSectionProps) {
  const { campaignId, supply } = props;

  const { updateCampaignSupply } = useUpdateCampaignSupply();

  return (
    <Stack spacing={2}>
      <SectionHeading label={"Supply"} />
      <Track
        sx={(theme) => ({
          mt: 4,
          mb: 4,
          maxWidth: 400,
          px: 2,
          [theme.breakpoints.up("md")]: { px: 3 },
        })}
        min={supplyTrack.min}
        max={supplyTrack.max}
        value={supply}
        onChange={(newValue) =>
          updateCampaignSupply({ campaignId, supply: newValue })
        }
      />
      <div>
        <CampaignProgressTracks campaignId={campaignId} addPadding />
      </div>
    </Stack>
  );
}
