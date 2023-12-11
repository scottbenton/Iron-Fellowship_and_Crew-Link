import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SnackbarProvider } from "./SnackbarProvider";
import { ConfirmProvider } from "material-ui-confirm";
import { AnalyticsProvider } from "lib/analytics.lib";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export function AppProviders(props: PropsWithChildren) {
  const { children } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    </LocalizationProvider>
  );
}
