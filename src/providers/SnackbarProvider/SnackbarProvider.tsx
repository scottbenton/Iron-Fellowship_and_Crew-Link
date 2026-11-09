import { PropsWithChildren } from "react";
import { SnackbarProvider as NotistackSnackbarProvider } from "notistack";
import { Snackbar } from "./Snackbar";

export function SnackbarProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <NotistackSnackbarProvider
      maxSnack={3}
      // Long enough for a screen reader to finish reading the message and
      // for someone to reach it. Errors and warnings stay until closed.
      autoHideDuration={10000}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      preventDuplicate
      Components={{
        info: Snackbar,
        success: Snackbar,
        warning: Snackbar,
        error: Snackbar,
      }}
    >
      {children}
    </NotistackSnackbarProvider>
  );
}
