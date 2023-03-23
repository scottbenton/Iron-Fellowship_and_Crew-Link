import { Button } from "@mui/material";
import { useListenToOracleSettings } from "api/user/settings/listenToOracleSettings";
import { CampaignGMScreenPage } from "features/campaign-gm-screen/CampaignGMScreenPage";
import { WorldCreatePage } from "features/world-create/WorldCreatePage";
import { WorldSelectPage } from "features/world-select/WorldSelectPage";
import { WorldSheetPage } from "features/world-sheet/WorldSheetPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useListenToUsersCampaigns } from "./api/campaign/listenToUsersCampaigns";
import { useListenToUsersCharacters } from "./api/characters/listenToUsersCharacters";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { Layout } from "./components/Layout";
import { CampaignJoinPage } from "./features/campaign-join/CampaignJoinPage";
import { CampaignListPage } from "./features/campaign-list/CampaignListPage";
import { CampaignSheetPage } from "./features/campaign-sheet/CampaignSheetPage";
import { CharacterCreatePage } from "./features/character-create/CharacterCreatePage";
import { CharacterSelectPage } from "./features/character-select/CharacterSelectPage";
import { CharacterSheetPage } from "./features/character-sheet/CharacterSheetPage";
import { loginWithGoogle } from "./lib/auth.lib";
import { paths, ROUTES } from "./routes";

export function App() {
  useListenToUsersCampaigns();
  useListenToUsersCharacters();
  useListenToOracleSettings();

  return (
    <Layout>
      <Routes>
        <Route
          path={"/"}
          element={<Navigate to={paths[ROUTES.CHARACTER_SELECT]} />}
        />
        <Route
          path={paths[ROUTES.CHARACTER_SELECT]}
          element={<CharacterSelectPage />}
        />
        <Route
          path={paths[ROUTES.CHARACTER_CREATE]}
          element={<CharacterCreatePage />}
        />
        <Route
          path={paths[ROUTES.CHARACTER_SHEET]}
          element={<CharacterSheetPage />}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_SELECT]}
          element={<CampaignListPage />}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_SHEET]}
          element={<CampaignSheetPage />}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_JOIN]}
          element={<CampaignJoinPage />}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_GM_SCREEN]}
          element={<CampaignGMScreenPage />}
        />
        <Route
          path={paths[ROUTES.WORLD_SELECT]}
          element={<WorldSelectPage />}
        />
        <Route
          path={paths[ROUTES.WORLD_CREATE]}
          element={<WorldCreatePage />}
        />
        <Route path={paths[ROUTES.WORLD_SHEET]} element={<WorldSheetPage />} />
        <Route
          path={paths[ROUTES.LOGIN]}
          element={
            <EmptyState
              imageSrc="/assets/nature.svg"
              title={"Get Started on Iron Fellowship"}
              message={"Create your account or login to start"}
              callToAction={
                <Button
                  size={"large"}
                  variant={"contained"}
                  onClick={() => loginWithGoogle()}
                >
                  Login with Google
                </Button>
              }
            />
          }
        />
      </Routes>
    </Layout>
  );
}
