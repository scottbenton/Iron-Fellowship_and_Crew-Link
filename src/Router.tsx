import { useListenToOracleSettings } from "api/user/settings/listenToOracleSettings";
import { useListenToUsersWorlds } from "api/worlds/listenToUsersWorlds";
import { CampaignGMScreenPage } from "pages/Campaign/CampaignGMScreenPage";
import { WorldCreatePage } from "pages/World/WorldCreatePage";
import { useListenToUsersCampaigns } from "./api/campaign/listenToUsersCampaigns";
import { useListenToUsersCharacters } from "./api/characters/listenToUsersCharacters";
import { Layout } from "./components/Layout";
import { CampaignJoinPage } from "pages/Campaign/CampaignJoinPage";
import { CharacterCreatePage } from "./pages/Character/CharacterCreatePage";
import { CharacterSelectPage } from "./pages/Character/CharacterSelectPage";
import { getUser } from "./lib/auth.lib";
import { BASE_ROUTES, basePaths } from "./routes";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ErrorRoute } from "components/ErrorRoute";
import { CHARACTER_ROUTES, characterPaths } from "pages/Character/routes";
import { CharacterSheetPage } from "pages/Character/CharacterSheetPage";
import { LoginPage } from "pages/LoginPage";
import { CampaignSelectPage } from "pages/Campaign/CampaignSelectPage";
import { CAMPAIGN_ROUTES, campaignPaths } from "pages/Campaign/routes";
import { CampaignSheetPage } from "pages/Campaign/CampaignSheetPage";
import { WorldSelectPage } from "pages/World/WorldSelectPage";
import { WORLD_ROUTES, worldPaths } from "pages/World/routes";
import { WorldSheetPage } from "pages/World/WorldSheetPage";
import { CharacterCardPage } from "pages/Character/CharacterCardPage";
import { SignupPage } from "pages/Authentication/SignupPage";
import { HomePage } from "pages/Home";
import { HeadProvider } from "providers/HeadProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path={"/"}
        element={
          <HeadProvider>
            <Layout />
          </HeadProvider>
        }
        errorElement={<ErrorRoute />}
        loader={async () => {
          // Wait for user to load in before displaying anything.
          // Actual logic for redirecting user based on authentication is present in Layout.tsx
          await getUser();
          return null;
        }}
        shouldRevalidate={() => false}
      >
        <Route index element={<HomePage />} />
        {/* Authenticated Pages */}
        <Route>
          <Route path={basePaths[BASE_ROUTES.CHARACTER]}>
            <Route index element={<CharacterSelectPage />} />
            <Route
              path={characterPaths[CHARACTER_ROUTES.CREATE]}
              element={<CharacterCreatePage />}
            />
            <Route
              path={characterPaths[CHARACTER_ROUTES.SHEET]}
              element={<CharacterSheetPage />}
            />
          </Route>
          <Route path={basePaths[BASE_ROUTES.CAMPAIGN]}>
            <Route index element={<CampaignSelectPage />} />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.SHEET]}
              element={<CampaignSheetPage />}
            />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.GM_SCREEN]}
              element={<CampaignGMScreenPage />}
            />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.JOIN]}
              element={<CampaignJoinPage />}
            />
          </Route>
          <Route path={basePaths[BASE_ROUTES.WORLD]}>
            <Route index element={<WorldSelectPage />} />
            <Route
              path={worldPaths[WORLD_ROUTES.CREATE]}
              element={<WorldCreatePage />}
            />
            <Route
              path={worldPaths[WORLD_ROUTES.SHEET]}
              element={<WorldSheetPage />}
            />
          </Route>
          {/* Unauthenticated Pages */}
        </Route>
        <Route>
          <Route path={basePaths[BASE_ROUTES.LOGIN]} element={<LoginPage />} />
          <Route
            path={basePaths[BASE_ROUTES.SIGNUP]}
            element={<SignupPage />}
          />
        </Route>
      </Route>
      <Route
        path={
          basePaths[BASE_ROUTES.CHARACTER] +
          "/" +
          characterPaths[CHARACTER_ROUTES.CARD]
        }
        element={
          <HeadProvider>
            <CharacterCardPage />
          </HeadProvider>
        }
      />
    </>
  )
);

export function Router() {
  useListenToUsersCampaigns();
  useListenToUsersCharacters();
  useListenToOracleSettings();
  useListenToUsersWorlds();

  return <RouterProvider router={router} />;
}
