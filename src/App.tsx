import { Button } from "@mui/material";
import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUsersCampaigns } from "./api/useUsersCampaigns";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { Layout } from "./components/Layout";
import { CampaignJoinPage } from "./features/campaign-join/CampaignJoinPage";
import { CampaignListPage } from "./features/campaign-list/CampaignListPage";
import { CampaignSheetPage } from "./features/campaign-sheet/CampaignSheetPage";
import { CharacterCreatePage } from "./features/character-create/CharacterCreatePage";
import { CharacterSelectPage } from "./features/character-select/CharacterSelectPage";
import { CharacterSheetPage } from "./features/character-sheet/CharacterSheetPage";
import { useAuth } from "./hooks/useAuth";
import { loginWithGoogle } from "./lib/auth.lib";
import { paths, ROUTES } from "./routes";
import { useCharacterStore } from "./stores/character.store";

export function App() {
  const { user } = useAuth();
  const getUsersCharacters = useCharacterStore(
    (store) => store.getUsersCharacters
  );

  useUsersCampaigns();

  useEffect(() => {
    let unsubscribe: Unsubscribe | null;
    if (user) {
      unsubscribe = getUsersCharacters();
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [getUsersCharacters, user]);

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
          path={paths[ROUTES.LOGIN]}
          element={
            <EmptyState
              imageSrc="/assets/nature.svg"
              title={"Get Started on Iron Journal"}
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
