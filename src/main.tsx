import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "providers/AppProviders";
import { Router } from "Router";
import "./styles.css";
import "./polyfills";

import "@fontsource-variable/rubik";
import "@fontsource/bebas-neue";
import { Dice } from "components/shared/Dice";
import { markDiceUnavailable } from "stores/appState/rollers/rollDice";

// Without WebGL the 3D dice cannot start. Rolls then skip them at once
// rather than waiting for them to time out.
Promise.resolve()
  .then(() => Dice.init())
  .catch(() => markDiceUnavailable());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <Router />
    </AppProviders>
  </React.StrictMode>
);
