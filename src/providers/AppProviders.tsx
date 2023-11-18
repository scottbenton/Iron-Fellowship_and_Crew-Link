import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ConfirmProvider } from "material-ui-confirm";
import { AnalyticsProvider } from "lib/analytics.lib";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <AnalyticsProvider>
      <ThemeProvider>
        <ConfirmProvider
          defaultOptions={{ cancellationButtonProps: { color: "inherit" } }}
        >
          <SnackbarProvider>
            <>{children}</>
          </SnackbarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </AnalyticsProvider>
  );
}
