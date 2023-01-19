import { Box, Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { constructCampaignSheetUrl, paths, ROUTES } from "../../routes";
import { useCampaignJoinStore } from "./campaign-join.store";

export function CampaignJoinPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const campaign = useCampaignJoinStore((store) => store.campaign);
  const loading = useCampaignJoinStore((store) => store.loading);
  const error = useCampaignJoinStore((store) => store.error);
  const joinCampaign = useCampaignJoinStore((store) => store.joinCampaign);
  const loadCampaign = useCampaignJoinStore((store) => store.loadCampaign);

  const [isJoining, setIsJoining] = useState<boolean>(false);

  const handleJoinCampaign = () => {
    setIsJoining(true);
    if (campaignId) {
      joinCampaign(campaignId)
        .then(() => {
          navigate(constructCampaignSheetUrl(campaignId));
        })
        .finally(() => {
          setIsJoining(false);
        });
    }
  };

  useEffect(() => {
    if (campaignId) {
      loadCampaign(campaignId);
    }
  }, [campaignId]);

  if (loading || !campaignId) {
    return (
      <LinearProgress
        sx={{
          width: "100vw",
          position: "absolute",
          left: 0,
          marginTop: -3,
        }}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title={"Error loading Campaign"}
        message={error}
        imageSrc={"/assets/nature.svg"}
        callToAction={
          <Button
            size={"large"}
            variant={"contained"}
            component={Link}
            to={paths[ROUTES.CAMPAIGN_SELECT]}
          >
            Go to your Campaigns
          </Button>
        }
      />
    );
  }

  if (!campaign) return null;

  return (
    <EmptyState
      title={`Join ${campaign.name}`}
      message={"Find your group and begin your journey"}
      imageSrc={"/assets/nature.svg"}
      callToAction={
        <Button
          size={"large"}
          variant={"contained"}
          onClick={() => handleJoinCampaign()}
          disabled={isJoining}
        >
          Start your Journey
        </Button>
      }
    />
  );
}
