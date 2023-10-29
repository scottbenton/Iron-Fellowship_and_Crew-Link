import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ConfirmProvider } from "material-ui-confirm";
import { DieRollProvider } from "providers/DieRollProvider";
import { LinkedDialogProvider } from "./LinkedDialogProvider";
import { AnalyticsProvider } from "lib/analytics.lib";
import { ScreenReaderAnnouncementProvider } from "./ScreenReaderAnnouncementProvider";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <AnalyticsProvider>
      <ThemeProvider>
        <ScreenReaderAnnouncementProvider>
          <ConfirmProvider
            defaultOptions={{ cancellationButtonProps: { color: "inherit" } }}
          >
            <SnackbarProvider>
              <DieRollProvider>
                <LinkedDialogProvider>
                  <>{children}</>
                </LinkedDialogProvider>
              </DieRollProvider>
            </SnackbarProvider>
          </ConfirmProvider>
        </ScreenReaderAnnouncementProvider>
      </ThemeProvider>
    </AnalyticsProvider>
  );
}
