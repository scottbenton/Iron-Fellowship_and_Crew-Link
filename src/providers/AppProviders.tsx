import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { DieRollProvider } from "providers/DieRollProvider";
import { LinkedDialogProvider } from "./LinkedDialogProvider";
import { AuthProvider } from "./AuthProvider";
import { AnalyticsProvider } from "lib/analytics.lib";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <AnalyticsProvider>
      <ThemeProvider>
        <ConfirmProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            preventDuplicate
          >
            <AuthProvider>
              <DieRollProvider>
                <LinkedDialogProvider>
                  <>{children}</>
                </LinkedDialogProvider>
              </DieRollProvider>
            </AuthProvider>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </AnalyticsProvider>
  );
}
