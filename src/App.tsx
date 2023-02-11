import { Button } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useListenToUsersCampaigns } from "./api/campaign/listenToUsersCampaigns";
import { useListenToUsersCharacters } from "./api/characters/listenToUsersCharacters";
import { DieRollProvider } from "./components/DieRollProvider";
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
          element={
            <DieRollProvider>
              <CharacterSheetPage />
            </DieRollProvider>
          }
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
