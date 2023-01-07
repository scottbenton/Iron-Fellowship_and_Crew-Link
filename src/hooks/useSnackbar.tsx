import { IconButton } from "@mui/material";
import { SnackbarKey, useSnackbar as useSnackbarNS } from "notistack";
import { ReactNode, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function useSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbarNS();

  const info = useCallback((message: string, action?: ReactNode) => {
    enqueueSnackbar(message, {
      action: (key) => mergeActions(key, closeSnackbar, action),
      variant: "info",
    });
  }, []);

  const success = useCallback((message: string, action?: ReactNode) => {
    enqueueSnackbar(message, {
      action: (key) => mergeActions(key, closeSnackbar, action),
      variant: "success",
    });
  }, []);

  const warning = useCallback((message: string, action?: ReactNode) => {
    enqueueSnackbar(message, {
      action: (key) => mergeActions(key, closeSnackbar, action),
      variant: "warning",
    });
  }, []);

  const error = useCallback((message: string, action?: ReactNode) => {
    enqueueSnackbar(message, {
      action: (key) => mergeActions(key, closeSnackbar, action),
      variant: "error",
    });
  }, []);

  return { info, success, warning, error };
}

const mergeActions = (
  key: SnackbarKey,
  closeSnackbar: (key: SnackbarKey) => void,
  action?: ReactNode
) => {
  if (action) return action;

  return (
    <IconButton onClick={() => closeSnackbar(key)} color={"inherit"}>
      <CloseIcon />
    </IconButton>
  );
};
