import { LinearProgress } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CampaignSheetHeader } from "./components/CampaignSheetHeader";
import { CharacterSection } from "./components/CharacterSection";
import { WorldSection } from "./components/WorldSection";
import { PageContent } from "components/Layout";
import { BreakContainer } from "components/BreakContainer";
import { TracksSection } from "./components/TracksSection";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import { WorldEmptyState } from "components/WorldEmptyState";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useSyncStore } from "./hooks/useSyncStore";

enum TABS {
  CHARACTER = "characters",
  WORLD = "world",
  TRACKS = "tracks",
}

export function CampaignSheetPage() {
  useSyncStore();

  const uid = useStore((store) => store.auth.uid);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.CHARACTER
  );
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
    setSearchParams({ tab });
  };

  const loading = useStore((store) => store.campaigns.loading);
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const campaign = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign
  );

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
  }

  if (!campaignId || !campaign) {
    return null;
  }

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
            indicatorColor="primary"
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
              <WorldSection />
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
