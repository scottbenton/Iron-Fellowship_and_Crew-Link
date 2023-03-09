import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { DieRollProvider } from "providers/DieRollProvider";
import { LinkedDialogProvider } from "./LinkedDialogProvider";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ConfirmProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            preventDuplicate
          >
            <DieRollProvider>
              <LinkedDialogProvider>
                <>{children}</>
              </LinkedDialogProvider>
            </DieRollProvider>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
