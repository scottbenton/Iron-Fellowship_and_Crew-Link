import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "providers/AppProviders";
import { Router } from "Router";
import "./styles.css";
import "./polyfills";

import "@fontsource-variable/rubik";
import "@fontsource/bebas-neue";
import { Dice } from "components/shared/Dice";
import { installStaleChunkReload } from "lib/staleChunkReload.lib";

installStaleChunkReload();
Dice.init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <Router />
    </AppProviders>
  </React.StrictMode>
);
