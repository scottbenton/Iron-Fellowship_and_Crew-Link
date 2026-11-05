import { ForwardedRef, forwardRef, useEffect } from "react";
import { CustomContentProps } from "notistack";
import { Alert } from "@mui/material";
import { closeSnackbar } from "notistack";
import { useStore } from "stores/store";

const SnackbarComponent = (
  props: CustomContentProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const { message, variant, action, id, style } = props;

  // Errors and warnings are alerts, which screen readers read at once, even
  // as they appear. Other messages go through the app's live region instead:
  // a status region added with its text already in it is often not read,
  // and the live region also reaches people inside an open dialog.
  const isUrgent = variant === "error" || variant === "warning";
  const announce = useStore((store) => store.appState.announce);
  useEffect(() => {
    if (!isUrgent && typeof message === "string") {
      announce(message);
    }
    // Read once, when the message first shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Alert
      key={id}
      style={style}
      ref={ref}
      severity={variant === "default" ? "info" : variant}
      role={isUrgent ? "alert" : "none"}
      closeText={"Close notification"}
      variant={"filled"}
      action={typeof action === "function" ? action(id) : action}
      onClose={() => closeSnackbar(id)}
    >
      {message}
    </Alert>
  );
};

export const Snackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  SnackbarComponent
);
