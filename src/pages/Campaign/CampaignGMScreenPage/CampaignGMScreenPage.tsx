import { Grid, Hidden, LinearProgress } from "@mui/material";
import { MovesSection } from "components/MovesSection/MovesSection";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TabsSection } from "./components/TabsSection";
import {
  CAMPAIGN_ROUTES,
  constructCampaignPath,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { PageContent, PageHeader } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";
import { useSyncStore } from "./hooks/useSyncStore";
import { useStore } from "stores/store";

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
    if (!loading && (!campaignId || !campaigns[campaignId])) {
      error("You aren't a member of this campaign");
      navigate(constructCampaignPath(CAMPAIGN_ROUTES.SELECT));
    }
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
  }, [loading, campaigns, campaignId, uid]);

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

  if (!campaignId || !campaign || !uid || !campaign?.gmIds?.includes(uid)) {
    return null;
  }

  return (
    <>
      <Head
        title={campaign.name}
        description={`GM Screen for ${campaign.name}`}
      />
      <PageHeader />
      <PageContent isPaper>
        <Grid
          container
          spacing={2}
          display={"flex"}
          sx={(theme) => ({
            [theme.breakpoints.up("md")]: {
              height: "100vh",
              overflow: "hidden",
            },
            py: 2,
          })}
        >
          <Hidden mdDown>
            <Grid
              item
              xs={12}
              md={4}
              lg={3}
              sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                  height: "100%",
                },
              })}
            >
              <MovesSection />
            </Grid>
          </Hidden>
          <Grid
            item
            xs={12}
            md={8}
            lg={9}
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: { height: "100%" },
            })}
          >
            <TabsSection campaign={campaign} campaignId={campaignId} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}
