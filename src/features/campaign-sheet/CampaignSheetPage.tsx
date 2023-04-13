import { Box, LinearProgress, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateCampaignSupply } from "../../api/campaign/updateCampaignSupply";
import { SectionHeading } from "../../components/SectionHeading";
import { supplyTrack } from "../../data/defaultTracks";
import { useSnackbar } from "../../hooks/useSnackbar";
import { paths, ROUTES } from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { Track } from "../../components/Track";
import { CampaignProgressTracks } from "./components/CampaignProgressTracks";
import { CampaignSheetHeader } from "./components/CampaignSheetHeader";
import { CharacterSection } from "./components/CharacterSection";
import { TracksSection } from "./components/TracksSection";
import { WorldSheet } from "components/WorldSheet";
import { useWorldsStore } from "stores/worlds.store";

enum TABS {
  WORLD,
  TRACKS,
}

export function CampaignSheetPage() {
  const { campaignId } = useParams();

  const { error } = useSnackbar();
  const navigate = useNavigate();

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);
  const worlds = useWorldsStore((store) => store.worlds);

  const [openTab, setOpenTab] = useState<TABS>(TABS.WORLD);

  useEffect(() => {
    if (!loading && (!campaignId || !campaigns[campaignId])) {
      error("You aren't a member of this campaign");
      navigate(paths[ROUTES.CAMPAIGN_SELECT]);
    }
  }, [loading, campaigns, campaignId]);

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
  }

  if (!campaignId || !campaigns[campaignId]) {
    return null;
  }

  const campaign = campaigns[campaignId];
  const world = campaign.worldId ? worlds[campaign.worldId] : undefined;

  return (
    <>
      <CampaignSheetHeader campaign={campaign} campaignId={campaignId} />
      <CharacterSection campaign={campaign} campaignId={campaignId} />

      {campaign.worldId && (
        <Tabs
          value={openTab}
          onChange={(evt, value) => setOpenTab(value)}
          indicatorColor={"secondary"}
          centered
          sx={(theme) => ({
            backgroundColor: theme.palette.background.default,

            marginX: -3,
            paddingX: 3,

            [theme.breakpoints.down("sm")]: {
              flexDirection: "column",

              marginX: -2,
              paddingX: 2,
            },
            mt: 4,
          })}
        >
          <Tab value={TABS.WORLD} label={"World"} />
          <Tab value={TABS.TRACKS} label={"Tracks"} />
        </Tabs>
      )}
      {campaign.worldId && openTab === TABS.WORLD && world && (
        <WorldSheet worldId={campaign.worldId} world={world} canEdit={false} />
      )}
      {(!campaign.worldId || openTab === TABS.TRACKS) && (
        <TracksSection
          campaign={campaign}
          campaignId={campaignId}
          addTopMargin={!campaign.worldId}
        />
      )}
    </>
  );
}
