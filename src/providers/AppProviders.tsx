import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ConfirmProvider } from "material-ui-confirm";
import { DieRollProvider } from "providers/DieRollProvider";
import { LinkedDialogProvider } from "./LinkedDialogProvider";
import { AnalyticsProvider } from "lib/analytics.lib";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <AnalyticsProvider>
      <ThemeProvider>
        <ConfirmProvider>
          <SnackbarProvider>
            <DieRollProvider>
              <LinkedDialogProvider>
                <>{children}</>
              </LinkedDialogProvider>
            </DieRollProvider>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </AnalyticsProvider>
  );
}
