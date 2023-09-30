import { Layout } from "./components/Layout";
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
import { CAMPAIGN_ROUTES, campaignPaths } from "pages/Campaign/routes";
import { WORLD_ROUTES, worldPaths } from "pages/World/routes";
import { HeadProvider } from "providers/HeadProvider";
import { useListenToCharacters } from "stores/character/useListenToCharacters";
import { useListenToCampaigns } from "stores/campaign/useListenToCampaigns";
import { useListenToAuth } from "stores/auth/useListenToAuth";
import { useListenToWorlds } from "stores/world/useListenToWorlds";
import { useListenToOracleSettings } from "stores/settings/useListenToOracleSettings";

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
        <Route index lazy={() => import("pages/Home")} />
        {/* Authenticated Pages */}
        <Route>
          <Route path={basePaths[BASE_ROUTES.CHARACTER]}>
            <Route
              index
              lazy={() => import("pages/Character/CharacterSelectPage")}
            />
            <Route
              path={characterPaths[CHARACTER_ROUTES.CREATE]}
              lazy={() => import("pages/Character/CharacterCreatePage")}
            />
            <Route
              path={characterPaths[CHARACTER_ROUTES.SHEET]}
              lazy={() => import("pages/Character/CharacterSheetPage")}
            />
          </Route>
          <Route path={basePaths[BASE_ROUTES.CAMPAIGN]}>
            <Route
              index
              lazy={() => import("pages/Campaign/CampaignSelectPage")}
            />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.SHEET]}
              lazy={() => import("pages/Campaign/CampaignSheetPage")}
            />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.GM_SCREEN]}
              lazy={() => import("pages/Campaign/CampaignGMScreenPage")}
            />
            <Route
              path={campaignPaths[CAMPAIGN_ROUTES.JOIN]}
              lazy={() => import("pages/Campaign/CampaignJoinPage")}
            />
          </Route>
          <Route path={basePaths[BASE_ROUTES.WORLD]}>
            <Route index lazy={() => import("pages/World/WorldSelectPage")} />
            <Route
              path={worldPaths[WORLD_ROUTES.SHEET]}
              lazy={() => import("pages/World/WorldSheetPage")}
            />
          </Route>
          {/* Unauthenticated Pages */}
        </Route>
        <Route>
          <Route
            path={basePaths[BASE_ROUTES.LOGIN]}
            lazy={() => import("pages/Authentication/LoginPage")}
          />
          <Route
            path={basePaths[BASE_ROUTES.SIGNUP]}
            lazy={() => import("pages/Authentication/SignupPage")}
          />
        </Route>
      </Route>
      <Route
        path={
          basePaths[BASE_ROUTES.CHARACTER] +
          "/" +
          characterPaths[CHARACTER_ROUTES.CARD]
        }
        lazy={() => import("pages/Character/CharacterCardPage")}
      />
    </>
  )
);

export function Router() {
  useListenToAuth();

  useListenToCharacters();
  useListenToCampaigns();
  useListenToWorlds();
  useListenToOracleSettings();

  return <RouterProvider router={router} />;
}
