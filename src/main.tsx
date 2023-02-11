import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "@fontsource/staatliches";
import "@fontsource/rubik/variable.css";
import { ThemeProvider } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ConfirmProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            preventDuplicate
          >
            <App />
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
