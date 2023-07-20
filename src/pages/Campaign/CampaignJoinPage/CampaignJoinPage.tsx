import { Button, LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useCampaignStore } from "stores/campaigns.store";
import { useAddUserToCampaign } from "api/campaign/addUserToCampaign";
import { useGetCampaign } from "api/campaign/getCampaign";
import { EmptyState } from "components/EmptyState/EmptyState";
import { useAuth } from "providers/AuthProvider";
import {
  CAMPAIGN_ROUTES,
  constructCampaignPath,
  constructCampaignSheetPath,
} from "../routes";
import { PageContent, PageHeader } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";

export function CampaignJoinPage() {
  const { campaignId } = useParams();
  const uid = useAuth().user?.uid;

  const {
    campaign,
    loading: loadingGetCampaign,
    error,
    getCampaign,
  } = useGetCampaign();
  const { addUserToCampaign, loading: isJoining } = useAddUserToCampaign();
  const campaigns = useCampaignStore((store) => store.campaigns);

  const handleJoinCampaign = () => {
    if (campaignId && uid) {
      addUserToCampaign({ campaignId, userId: uid }).catch(() => {});
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
            to={constructCampaignPath(CAMPAIGN_ROUTES.SELECT)}
          >
            Go to your Campaigns
          </Button>
        }
      />
    );
  }

  if (!campaign) return null;

  if (uid && campaigns && campaigns[campaignId]?.users.includes(uid)) {
    return (
      <Navigate
        to={constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)}
      />
    );
  }

  return (
    <>
      <Head
        title={`Join ${campaign.name}`}
        description={
          "Join your group and begin your adventure on Iron Fellowship"
        }
        openGraphImageSrc="/assets/ironsworn-opengraph-join-campaign.svg"
      />
      <PageHeader label={"Join " + campaign.name} />
      <PageContent isPaper>
        <EmptyState
          title={`Join the fun`}
          message={"Find your group and begin your journey"}
          imageSrc={"/assets/nature.svg"}
          callToAction={
            <Button
              size={"large"}
              variant={"contained"}
              onClick={() => handleJoinCampaign()}
              disabled={isJoining}
            >
              Join {campaign.name}
            </Button>
          }
        />
      </PageContent>
    </>
  );
}
