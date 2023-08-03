import { Grid, Hidden, LinearProgress } from "@mui/material";
import { MovesSection } from "components/MovesSection/MovesSection";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCampaignStore } from "stores/campaigns.store";
import { TabsSection } from "./components/TabsSection";
import { useCampaignGMScreenApiCalls } from "./hooks.ts/useCampaignGMScreenApiCalls";
import {
  CAMPAIGN_ROUTES,
  constructCampaignPath,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { PageContent, PageHeader } from "components/Layout";
import { Head } from "providers/HeadProvider/Head";

export function CampaignGMScreenPage() {
  const { campaignId } = useParams();

  useCampaignGMScreenApiCalls(campaignId);

  const uid = useAuth().user?.uid;

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);

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
      campaigns[campaignId] &&
      uid &&
      !campaigns[campaignId].gmIds?.includes(uid)
    ) {
      error("You aren't the GM of this campaign");
      navigate(constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET));
    }
  }, [loading, campaigns, campaignId, uid]);

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
  }

  if (
    !campaignId ||
    !campaigns[campaignId] ||
    !uid ||
    !campaigns[campaignId]?.gmIds?.includes(uid)
  ) {
    return null;
  }

  const campaign = campaigns[campaignId];

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
