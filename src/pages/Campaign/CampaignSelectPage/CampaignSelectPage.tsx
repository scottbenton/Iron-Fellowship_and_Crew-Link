import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
  Hidden,
  Fab,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "components/EmptyState/EmptyState";
import { CAMPAIGN_ROUTES, constructCampaignSheetPath } from "../routes";
import { useCampaignStore } from "stores/campaigns.store";
import { CreateCampaignDialog } from "./components/CreateCampaignDialog";
import CreateCampaignIcon from "@mui/icons-material/GroupAdd";
import { PageContent, PageHeader } from "components/Layout";
import { CampaignCard } from "./components/CampaignCard";
import { Head } from "providers/HeadProvider/Head";

export function CampaignSelectPage() {
  const campaigns = useCampaignStore((store) =>
    Object.keys(store.campaigns).sort((key1, key2) => {
      const name1 = store.campaigns[key1].name;
      const name2 = store.campaigns[key2].name;

      if (name1 < name2) {
        return -1;
      } else if (name1 > name2) {
        return 1;
      }
      return 0;
    })
  );
  const campaignMap = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);

  const [createCampaignDialogOpen, setCreateCampaignDialogOpen] =
    useState<boolean>(false);

  if (loading) {
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

  return (
    <>
      <Head
        title={"Your Campaigns"}
        description={
          "A list of all the campaigns you have joined in Iron Fellowship"
        }
      />
      <PageHeader
        label={"Your Campaigns"}
        actions={
          <Hidden smDown>
            <Button
              onClick={() => setCreateCampaignDialogOpen(true)}
              color={"secondary"}
              variant={"contained"}
              endIcon={<CreateCampaignIcon />}
            >
              Create a Campaign
            </Button>
          </Hidden>
        }
      />
      <PageContent isPaper={campaigns.length === 0}>
        {campaigns.length === 0 ? (
          <EmptyState
            imageSrc="/assets/nature.svg"
            title={"Create your First Campaign"}
            message={
              "Campaigns allow you to share tracks, worlds, and more between GMs and players"
            }
            callToAction={
              <Button
                onClick={() => setCreateCampaignDialogOpen(true)}
                variant={"contained"}
                endIcon={<CreateCampaignIcon />}
              >
                Create a Campaign
              </Button>
            }
          />
        ) : (
          <Grid container spacing={2}>
            {campaigns.map((campaignId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CampaignCard
                  campaignId={campaignId}
                  campaign={campaignMap[campaignId]}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </PageContent>

      <Hidden smUp>
        <Box height={80} />
      </Hidden>
      <Hidden smUp>
        <Fab
          onClick={() => setCreateCampaignDialogOpen(true)}
          color={"secondary"}
          sx={(theme) => ({
            position: "fixed",
            bottom: theme.spacing(9),
            right: theme.spacing(2),
          })}
        >
          <CreateCampaignIcon />
        </Fab>
      </Hidden>
      <CreateCampaignDialog
        open={createCampaignDialogOpen}
        handleClose={() => setCreateCampaignDialogOpen(false)}
      />
    </>
  );
}
