import { PropsWithChildren } from "react";
import { SnackbarProvider as NotistackSnackbarProvider } from "notistack";
import { Snackbar } from "./Snackbar";

export function SnackbarProvider(props: PropsWithChildren) {
  const { children } = props;

  return (
    <NotistackSnackbarProvider
      maxSnack={3}
      autoHideDuration={5000}
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
