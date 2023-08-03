import { Box, LinearProgress, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { useCampaignStore } from "stores/campaigns.store";
import { CampaignSheetHeader } from "./components/CampaignSheetHeader";
import { CharacterSection } from "./components/CharacterSection";
import { WorldSection } from "./components/WorldSection";

import { CAMPAIGN_ROUTES, constructCampaignPath } from "../routes";
import { PageContent } from "components/Layout";
import { BreakContainer } from "components/BreakContainer";
import { TracksSection } from "./components/TracksSection";
import { EmptyState } from "components/EmptyState/EmptyState";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import { WorldEmptyState } from "components/WorldEmptyState";
import { useAuth } from "providers/AuthProvider";
import { Head } from "providers/HeadProvider/Head";

enum TABS {
  CHARACTER = "characters",
  WORLD = "world",
  TRACKS = "tracks",
}

export function CampaignSheetPage() {
  const { campaignId } = useParams();

  const { error } = useSnackbar();
  const navigate = useNavigate();
  const uid = useAuth().user?.uid;

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.CHARACTER
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);

  useEffect(() => {
    if (!loading && (!campaignId || !campaigns[campaignId])) {
      error("You aren't a member of this campaign");
      navigate(constructCampaignPath(CAMPAIGN_ROUTES.SELECT));
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

  return (
    <>
      <Head
        title={campaign.name}
        description={`Campaign page for ${campaign.name}.`}
      />
      <CampaignSheetHeader campaign={campaign} campaignId={campaignId} />
      <PageContent isPaper>
        <BreakContainer>
          <StyledTabs
            value={selectedTab}
            onChange={(evt, value) => handleTabChange(value)}
            indicatorColor="secondary"
            centered
            variant={"standard"}
          >
            <StyledTab value={TABS.CHARACTER} label={"Characters"} />
            <StyledTab value={TABS.WORLD} label={"World"} />
            <StyledTab value={TABS.TRACKS} label={"Tracks"} />
          </StyledTabs>
        </BreakContainer>
        {selectedTab === TABS.CHARACTER && (
          <CharacterSection campaign={campaign} campaignId={campaignId} />
        )}
        {selectedTab === TABS.WORLD && (
          <>
            {campaign.worldId ? (
              <WorldSection worldId={campaign.worldId} />
            ) : (
              <WorldEmptyState
                isGM={!!uid && (campaign.gmIds?.includes(uid) ?? false)}
                isMultiplayer
              />
            )}
          </>
        )}
        {selectedTab === TABS.TRACKS && (
          <TracksSection
            campaignId={campaignId}
            campaign={campaign}
            addTopMargin={false}
          />
        )}
      </PageContent>
    </>
  );
}
