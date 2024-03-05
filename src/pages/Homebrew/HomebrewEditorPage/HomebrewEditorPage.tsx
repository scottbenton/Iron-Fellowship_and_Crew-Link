import { Box, Button, LinearProgress } from "@mui/material";
import { PageContent, PageHeader } from "components/shared/Layout";
import { StyledTab, StyledTabs } from "components/shared/StyledTabs";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AboutSection } from "./AboutSection";
import { useStore } from "stores/store";
import { EmptyState } from "components/shared/EmptyState";
import { BASE_ROUTES, basePaths } from "routes";
import { RulesSection } from "./RulesSection";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { OracleSection } from "./OracleSection";
import { MovesSection } from "./MovesSection";
import { AssetsSection } from "./AssetsSection/AssetsSection";

enum TABS {
  ABOUT = "about",
  MOVES = "moves",
  ORACLES = "oracles",
  ASSETS = "assets",
  RULES = "rules",
}

export function HomebrewEditorPage() {
  const { homebrewId } = useParams();

  useListenToHomebrewContent(homebrewId ? [homebrewId] : []);

  const navigate = useNavigate();

  const loading = useStore((store) => store.homebrew.loading);
  const homebrewName = useStore((store) =>
    homebrewId && store.homebrew.collections[homebrewId]?.base
      ? store.homebrew.collections[homebrewId].base.title ??
        "Unnamed Collection"
      : undefined
  );
  const deleteCollection = useStore((store) => store.homebrew.deleteExpansion);

  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(
    (searchParams.get("tab") as TABS) ?? TABS.ABOUT
  );
  useUpdateQueryStringValueWithoutNavigation("tab", selectedTab);
  const handleTabChange = (tab: TABS) => {
    setSelectedTab(tab);
  };

  const [syncLoading, setSyncLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSyncLoading(false);
    }, 2 * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (loading || (!homebrewName && syncLoading)) {
    return <LinearProgress />;
  }
  if (!homebrewId || !homebrewName) {
    return (
      <EmptyState
        title={"Homebrew Collection not Found"}
        message={"Please try again from the homebrew selection page"}
        showImage
        callToAction={
          <Button
            component={Link}
            to={basePaths[BASE_ROUTES.HOMEBREW]}
            variant={"contained"}
            size={"large"}
          >
            Your Homebrew
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        label={homebrewName}
        subLabel='Coming Soon'
        actions={
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() =>
              deleteCollection(homebrewId)
                .then(() => {
                  navigate(basePaths[BASE_ROUTES.HOMEBREW]);
                })
                .catch(() => {})
            }
          >
            Delete Collection
          </Button>
        }
      />
      <PageContent isPaper>
        <Box
          sx={{
            mx: { xs: -2, sm: -3 },
          }}
        >
          <StyledTabs
            value={selectedTab}
            onChange={(evt, value) => handleTabChange(value)}
            sx={(theme) => ({
              borderTopRightRadius: theme.shape.borderRadius,
              borderTopLeftRadius: theme.shape.borderRadius,
            })}
          >
            <StyledTab label={"About"} value={TABS.ABOUT} />
            <StyledTab label={"Moves"} value={TABS.MOVES} />
            <StyledTab label={"Oracles"} value={TABS.ORACLES} />
            <StyledTab label={"Assets"} value={TABS.ASSETS} />
            <StyledTab label={"Rules"} value={TABS.RULES} />
          </StyledTabs>
          <Box role={"tabpanel"} sx={{ px: { xs: 2, sm: 3 } }}>
            {selectedTab === TABS.ABOUT && <AboutSection id={homebrewId} />}
            {selectedTab === TABS.MOVES && (
              <MovesSection homebrewId={homebrewId} />
            )}
            {selectedTab === TABS.ORACLES && <OracleSection id={homebrewId} />}
            {selectedTab === TABS.RULES && <RulesSection id={homebrewId} />}
            {selectedTab === TABS.ASSETS && <AssetsSection />}
          </Box>
        </Box>
      </PageContent>
    </>
  );
}
