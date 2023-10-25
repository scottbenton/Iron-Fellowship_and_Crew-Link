import { Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import {
  CAMPAIGN_ROUTES,
  constructCampaignPath,
  constructCampaignSheetPath,
} from "../routes";
import { PageContent, PageHeader } from "components/shared/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { StoredCampaign } from "types/Campaign.type";
import { useAppName } from "hooks/useAppName";
import { getPublicAssetPath } from "functions/getPublicAssetPath";

export function CampaignJoinPage() {
  const { campaignId } = useParams();
  const uid = useStore((store) => store.auth.uid);

  const [campaign, setCampaign] = useState<StoredCampaign>();
  const getCampaign = useStore((store) => store.campaigns.getCampaign);
  const [getCampaignLoading, setGetCampaignLoading] = useState(true);
  const [getCampaignError, setGetCampaignError] = useState<string>();

  useEffect(() => {
    if (campaignId) {
      getCampaign(campaignId)
        .then((campaign) => {
          setGetCampaignLoading(false);
          setCampaign(campaign);
        })
        .catch((e) => {
          setGetCampaignLoading(false);
          setGetCampaignError(
            typeof e === "string" ? e : "We could not load this campaign."
          );
        });
    }
  }, [getCampaign, campaignId]);

  const addUserToCampaign = useStore(
    (store) => store.campaigns.addUserToCampaign
  );
  const [addUserToCampaignLoading, setAddUserToCampaignLoading] =
    useState(false);

  const campaigns = useStore((store) => store.campaigns.campaignMap);

  const handleJoinCampaign = () => {
    if (campaignId && uid) {
      setAddUserToCampaignLoading(true);
      addUserToCampaign(uid, campaignId)
        .catch(() => {})
        .finally(() => setAddUserToCampaignLoading(false));
    }
  };

  useEffect(() => {
    if (campaignId) {
      getCampaign(campaignId).catch(() => {});
    }
  }, [campaignId]);

  const appName = useAppName();

  if (getCampaignLoading || !campaignId) {
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

  if (getCampaignError) {
    return (
      <EmptyState
        title={"Error loading Campaign"}
        message={getCampaignError}
        showImage
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
        description={`Join your group and begin your adventure on ${appName}`}
      />
      <PageHeader label={"Join " + campaign.name} />
      <PageContent isPaper>
        <EmptyState
          title={`Join the fun`}
          message={"Find your group and begin your journey"}
          showImage
          callToAction={
            <Button
              size={"large"}
              variant={"contained"}
              onClick={() => handleJoinCampaign()}
              disabled={addUserToCampaignLoading}
            >
              Join {campaign.name}
            </Button>
          }
        />
      </PageContent>
    </>
  );
}
