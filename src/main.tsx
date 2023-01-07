import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "@fontsource/staatliches";
import "@fontsource/rubik/variable.css";
import { ThemeProvider } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={5000}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
