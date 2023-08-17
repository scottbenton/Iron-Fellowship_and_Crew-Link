import { forwardRef } from "react";
import { CustomContentProps } from "notistack";
import { Alert } from "@mui/material";
import { closeSnackbar } from "notistack";

export const Snackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const { message, variant, action, id, style } = props;
    return (
      <Alert
        key={id}
        style={style}
        ref={ref}
        severity={variant === "default" ? "info" : variant}
        variant={"filled"}
        action={typeof action === "function" ? action(id) : action}
        onClose={() => closeSnackbar(id)}
      >
        {message}
      </Alert>
    );
  }
);
