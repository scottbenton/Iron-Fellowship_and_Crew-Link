import { Box, Button, LinearProgress, Typography } from "@mui/material";
import {
  PageContent,
  PageHeader,
  PageHeaderProps,
} from "components/shared/Layout";
import { StyledTab, StyledTabs } from "components/shared/StyledTabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AboutSection } from "./AboutSection";
import { useStore } from "stores/store";
import { EmptyState } from "components/shared/EmptyState";
import { BASE_ROUTES, basePaths } from "routes";
import { RulesSection } from "./RulesSection";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import { OracleSection } from "./OracleSection";
import { MovesSection } from "./MovesSection";
import { AssetsSection } from "./AssetsSection";
import { arrayUnion } from "firebase/firestore";
import { useSnackbar } from "providers/SnackbarProvider";
import { Head } from "providers/HeadProvider/Head";

enum TABS {
  ABOUT = "about",
  MOVES = "moves",
  ORACLES = "oracles",
  ASSETS = "assets",
  RULES = "rules",
}

export function HomebrewEditorPage() {
  const { homebrewId } = useParams();

  const homebrewIds = useMemo(() => {
    return homebrewId ? [homebrewId] : [];
  }, [homebrewId]);

  useListenToHomebrewContent(homebrewIds);

  const loading = useStore((store) => store.homebrew.loading);
  const homebrewDetails = useStore(
    (store) => {
      return store.homebrew.collections[homebrewId ?? ""]?.base;
    },
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
  const homebrewName = homebrewDetails?.title || "Unnamed Collection";

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

  const uid = useStore(
    (store) => store.auth.user?.uid,
    (a, b) => a === b
  );

  const { success } = useSnackbar();

  const updateHomebrewCollection = useStore(
    (store) => store.homebrew.updateExpansion
  );
  const addSelfAsViewer = useCallback(() => {
    if (homebrewId && uid) {
      updateHomebrewCollection(homebrewId, { viewers: arrayUnion(uid) })
        .catch(() => {})
        .then(() => {
          success("Added collection to your homebrew");
        });
    }
  }, [uid, updateHomebrewCollection, homebrewId, success]);

  if (loading || (!homebrewDetails && syncLoading)) {
    return <LinearProgress />;
  }
  if (!homebrewId || !homebrewDetails) {
    return (
      <>
        <Head title={"Homebrew Collection not Found"} />
        <PageHeader />
        <PageContent isPaper>
          <EmptyState
            isPageTitle
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
        </PageContent>
      </>
    );
  }

  const isLoggedIn = !!uid;
  const isEditor = uid
    ? homebrewDetails?.editors.includes(uid) ?? false
    : false;
  const isViewer = uid
    ? homebrewDetails?.viewers?.includes(uid) ?? false
    : false;
  const isOwner = uid ? homebrewDetails?.creator === uid : false;

  const getPageHeaderProps = (): Partial<PageHeaderProps> => {
    if (isEditor) {
      return {};
    } else if (isViewer) {
      return {};
    } else if (isLoggedIn) {
      return {
        subLabel: (
          <Typography variant={"body2"}>
            You can use this homebrew in your characters and campaigns by adding
            it to your library
          </Typography>
        ),
        actions: (
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={addSelfAsViewer}
          >
            Add to your Library
          </Button>
        ),
      };
    } else {
      return {
        subLabel: (
          <Typography variant={"body2"}>
            Log in or sign up to use this homebrew in your game
          </Typography>
        ),
        actions: (
          <>
            <Button color={"inherit"}>Log in</Button>
            <Button variant={"outlined"} color={"inherit"}>
              Sign Up
            </Button>
          </>
        ),
      };
    }
  };

  return (
    <>
      <Head title={homebrewName} />
      <PageHeader label={homebrewName} {...getPageHeaderProps()} />
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
            <StyledTab label={"Rules"} value={TABS.RULES} />
            <StyledTab label={"Moves"} value={TABS.MOVES} />
            <StyledTab label={"Oracles"} value={TABS.ORACLES} />
            <StyledTab label={"Assets"} value={TABS.ASSETS} />
          </StyledTabs>
          <Box role={"tabpanel"} sx={{ px: { xs: 2, sm: 3 } }}>
            {selectedTab === TABS.ABOUT && (
              <AboutSection
                id={homebrewId}
                isEditor={isEditor}
                isViewer={isViewer}
                isOwner={isOwner}
              />
            )}
            {selectedTab === TABS.RULES && (
              <RulesSection id={homebrewId} isEditor={isEditor} />
            )}
            {selectedTab === TABS.MOVES && (
              <MovesSection homebrewId={homebrewId} isEditor={isEditor} />
            )}
            {selectedTab === TABS.ORACLES && (
              <OracleSection id={homebrewId} isEditor={isEditor} />
            )}
            {selectedTab === TABS.ASSETS && (
              <AssetsSection homebrewId={homebrewId} isEditor={isEditor} />
            )}
          </Box>
        </Box>
      </PageContent>
    </>
  );
}
