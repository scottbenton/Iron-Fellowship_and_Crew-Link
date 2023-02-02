import {
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  Typography,
  Hidden,
  Fab,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { constructCampaignSheetUrl } from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { CreateCampaignDialog } from "./components/CreateCampaignDialog";
import CreateCampaignIcon from "@mui/icons-material/GroupAdd";

export function CampaignListPage() {
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

  const [createCampaignDialogOpen, setCreateCampaignDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      {campaigns.length === 0 ? (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Campaigns"}
          message={"Create your first campaign to get started"}
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
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              Your Campaigns
            </Typography>
            <Hidden smDown>
              <Button
                onClick={() => setCreateCampaignDialogOpen(true)}
                variant={"contained"}
                endIcon={<CreateCampaignIcon />}
              >
                Create a Campaign
              </Button>
            </Hidden>
          </Grid>
          {campaigns.map((campaignId, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant={"outlined"}>
                <CardActionArea
                  component={Link}
                  to={constructCampaignSheetUrl(campaignId)}
                  sx={{ p: 2 }}
                >
                  <Box display={"flex"} alignItems={"center"}>
                    <Typography variant={"h6"}>
                      {campaignMap[campaignId].name}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Hidden smUp>
        <Box height={80} />
      </Hidden>
      <Hidden smUp>
        <Fab
          onClick={() => setCreateCampaignDialogOpen(true)}
          color={"primary"}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
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
