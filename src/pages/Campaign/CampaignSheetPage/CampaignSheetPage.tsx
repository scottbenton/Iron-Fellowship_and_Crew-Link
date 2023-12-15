import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CampaignSheetHeader } from "./components/CampaignSheetHeader";
import { CharacterSection } from "./components/CharacterSection";
import { WorldSection } from "./components/WorldSection";
import { PageContent } from "components/shared/Layout";
import { BreakContainer } from "components/shared/BreakContainer";
import { TracksSection } from "./components/TracksSection";
import { StyledTabs, StyledTab } from "components/shared/StyledTabs";
import { WorldEmptyState } from "components/features/worlds/WorldEmptyState";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useSyncStore } from "./hooks/useSyncStore";
import { ClockSection } from "components/features/charactersAndCampaigns/Clocks/ClockSection";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";

enum TABS {
  CHARACTER = "characters",
  WORLD = "world",
  TRACKS = "tracks",
}

export function CampaignSheetPage() {
  useSyncStore();

  const showClocks = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const uid = useStore((store) => store.auth.uid);

  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<TABS>(
    (searchParams.get("tab") as TABS) ?? TABS.CHARACTER
  );
  useUpdateQueryStringValueWithoutNavigation("tab", selectedTab);
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
  };

  const loading = useStore((store) => store.campaigns.loading);
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const campaign = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign
  );

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
          <>
            <TracksSection campaign={campaign} addTopMargin={false} />
            {showClocks && <ClockSection headingBreakContainer />}
          </>
        )}
      </PageContent>
    </>
  );
}
