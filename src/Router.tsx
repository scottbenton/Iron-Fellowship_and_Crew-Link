import { Button } from "@mui/material";
import { useListenToOracleSettings } from "api/user/settings/listenToOracleSettings";
import { useListenToUsersWorlds } from "api/worlds/listenToUsersWorlds";
import { CampaignGMScreenPage } from "pages/Campaign/CampaignGMScreenPage";
import { WorldCreatePage } from "pages/World/WorldCreatePage";
import { useListenToUsersCampaigns } from "./api/campaign/listenToUsersCampaigns";
import { useListenToUsersCharacters } from "./api/characters/listenToUsersCharacters";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { Layout } from "./components/Layout";
import { CampaignJoinPage } from "pages/Campaign/CampaignJoinPage";
import { CharacterCreatePage } from "./pages/Character/CharacterCreatePage";
import { CharacterSelectPage } from "./pages/Character/CharacterSelectPage";
import { getUser, loginWithGoogle } from "./lib/auth.lib";
import { BASE_ROUTES, basePaths } from "./routes";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import { UserInfo, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "config/firebase.config";
import { ErrorRoute } from "components/ErrorRoute";
import { CHARACTER_ROUTES, characterPaths } from "pages/Character/routes";
import { CharacterSheetPage } from "pages/Character/CharacterSheetPage";
import { AssetsSection } from "pages/Character/CharacterSheetPage/Tabs/AssetsSection";
import { LoginPage } from "pages/LoginPage";
import { OracleSection } from "components/OracleSection";
import { UserDocument } from "types/User.type";
import { AUTH_STATE, useAuth } from "providers/AuthProvider";
import { useCallback, useEffect, useState } from "react";
import { CampaignSelectPage } from "pages/Campaign/CampaignSelectPage";
import { CAMPAIGN_ROUTES, campaignPaths } from "pages/Campaign/routes";
import { CampaignSheetPage } from "pages/Campaign/CampaignSheetPage";
import { WorldSelectPage } from "pages/World/WorldSelectPage";
import { WORLD_ROUTES, worldPaths } from "pages/World/routes";
import { WorldSheetPage } from "pages/World/WorldSheetPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={"/"}
      element={<Layout />}
      errorElement={<ErrorRoute />}
      loader={async () => {
        // Wait for user to load in before displaying anything.
        // Actual logic for redirecting user based on authentication is present in Layout.tsx
        await getUser();
        return null;
      }}
      shouldRevalidate={() => false}
    >
      <Route
        index
        loader={() => {
          return redirect(basePaths[BASE_ROUTES.CHARACTER]);
        }}
      />
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
      </Route>
    </Route>
  )
);

export function Router() {
  useListenToUsersCampaigns();
  useListenToUsersCharacters();
  useListenToOracleSettings();
  useListenToUsersWorlds();

  return <RouterProvider router={router} />;
}
