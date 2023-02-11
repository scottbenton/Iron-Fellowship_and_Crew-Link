import { Button, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAddUserToCampaign } from "../../api/campaign/addUserToCampaign";
import { useGetCampaign } from "../../api/campaign/getCampaign";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { useAuth } from "../../hooks/useAuth";
import { constructCampaignSheetUrl, paths, ROUTES } from "../../routes";

export function CampaignJoinPage() {
  const { campaignId } = useParams();
  const uid = useAuth().user?.uid;

  const navigate = useNavigate();

  const {
    campaign,
    loading: loadingGetCampaign,
    error,
    getCampaign,
  } = useGetCampaign();
  const { addUserToCampaign, loading: isJoining } = useAddUserToCampaign();

  const handleJoinCampaign = () => {
    if (campaignId && uid) {
      addUserToCampaign({ campaignId, userId: uid }).then(() => {
        navigate(constructCampaignSheetUrl(campaignId));
      });
    }
  };

  useEffect(() => {
    if (campaignId) {
      getCampaign(campaignId).catch(() => {});
    }
  }, [campaignId]);

  if (loadingGetCampaign || !campaignId) {
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

  if (uid && campaign.users.includes(uid)) {
    return <Navigate to={constructCampaignSheetUrl(campaignId)} />;
  }

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
