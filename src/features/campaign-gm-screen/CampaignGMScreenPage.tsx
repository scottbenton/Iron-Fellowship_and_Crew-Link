import { Grid, Hidden, LinearProgress } from "@mui/material";
import { MovesSection } from "components/MovesSection/MovesSection";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { constructCampaignSheetUrl, paths, ROUTES } from "routes";
import { useCampaignStore } from "stores/campaigns.store";
import { TabsSection } from "./components/TabsSection";
import { useCampaignGMScreenApiCalls } from "./hooks.ts/useCampaignGMScreenApiCalls";

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
      navigate(paths[ROUTES.CAMPAIGN_SELECT]);
    }
    if (
      !loading &&
      campaignId &&
      campaigns[campaignId] &&
      uid &&
      campaigns[campaignId].gmId !== uid
    ) {
      error("You aren't the GM of this campaign");
      navigate(constructCampaignSheetUrl(campaignId));
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
    campaigns[campaignId]?.gmId !== uid
  ) {
    return null;
  }

  const campaign = campaigns[campaignId];

  return (
    <>
      <Grid
        container
        spacing={2}
        display={"flex"}
        sx={(theme) => ({
          [theme.breakpoints.up("md")]: {
            height: "calc(100vh - 24px)",
            overflow: "hidden",
          },
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
          sx={(theme) => ({ [theme.breakpoints.up("md")]: { height: "100%" } })}
        >
          <TabsSection campaign={campaign} campaignId={campaignId} />
        </Grid>
      </Grid>
    </>
  );
}
