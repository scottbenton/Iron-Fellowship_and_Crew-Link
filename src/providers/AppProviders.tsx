import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { DieRollProvider } from "providers/DieRollProvider";
import { LinkedDialogProvider } from "./LinkedDialogProvider";
import { AuthProvider } from "./AuthProvider";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ThemeProvider>
      <ConfirmProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={5000}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          preventDuplicate
        >
          <AuthProvider>
            <BrowserRouter>
              <DieRollProvider>
                <LinkedDialogProvider>
                  <>{children}</>
                </LinkedDialogProvider>
              </DieRollProvider>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </ConfirmProvider>
    </ThemeProvider>
  );
}
