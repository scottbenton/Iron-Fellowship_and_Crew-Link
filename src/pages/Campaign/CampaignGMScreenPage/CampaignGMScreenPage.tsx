import { Button, LinearProgress } from "@mui/material";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabsSection } from "./components/TabsSection";
import {
  CAMPAIGN_ROUTES,
  constructCampaignPath,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { PageContent, PageHeader } from "components/shared/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useSyncStore } from "./hooks/useSyncStore";
import { useStore } from "stores/store";
import { Sidebar } from "pages/Character/CharacterSheetPage/components/Sidebar";
import { SectionWithSidebar } from "components/shared/Layout/SectionWithSidebar";
import { EmptyState } from "components/shared/EmptyState";
import { LinkComponent } from "components/shared/LinkComponent";

export function CampaignGMScreenPage() {
  useSyncStore();
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const uid = useStore((store) => store.auth.uid);

  const campaigns = useStore((store) => store.campaigns.campaignMap);
  const campaign = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign
  );
  const loading = useStore((store) => store.campaigns.loading);

  const { error } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !loading &&
      campaignId &&
      campaign &&
      uid &&
      !campaign.gmIds?.includes(uid)
    ) {
      error("You aren't the GM of this campaign");
      navigate(constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET));
    }
  }, [loading, campaigns, campaignId, uid, campaign, error, navigate]);

  const [syncLoading, setSyncLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSyncLoading(false);
    }, 2 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (loading || (!campaign && syncLoading)) {
    return <LinearProgress />;
  }

  if (!campaign || !campaignId) {
    return (
      <EmptyState
        title={"Campaign not Found"}
        message={"Please try again from the campaign selection page"}
        showImage
        callToAction={
          <Button
            LinkComponent={LinkComponent}
            href={constructCampaignPath(CAMPAIGN_ROUTES.SELECT)}
            variant={"contained"}
            size={"large"}
          >
            Select a Campaign
          </Button>
        }
      />
    );
  }
  if (!uid || !campaign.gmIds?.includes(uid)) {
    return null;
  }

  return (
    <>
      <Head
        title={campaign.name}
        description={`GM Screen for ${campaign.name}`}
      />
      <PageHeader />
      <PageContent
        isPaper
        viewHeight
        sx={{ pb: { xs: 0, md: 2 }, pt: { xs: 0, md: 2 } }}
      >
        <SectionWithSidebar
          sidebar={<Sidebar />}
          mainContent={<TabsSection campaign={campaign} />}
        />
      </PageContent>
    </>
  );
}
