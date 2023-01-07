import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CharacterCreatePage } from "./features/character-create/CharacterCreatePage";
import { CharacterSelectPage } from "./features/character-select/CharacterSelectPage";
import { paths, ROUTES } from "./routes";

export function App() {
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
          element={<>Character Sheet</>}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_SELECT]}
          element={<>Campaign Select</>}
        />
        <Route
          path={paths[ROUTES.CAMPAIGN_SHEET]}
          element={<>Campaign Sheet</>}
        />
      </Routes>
    </Layout>
  );
}
