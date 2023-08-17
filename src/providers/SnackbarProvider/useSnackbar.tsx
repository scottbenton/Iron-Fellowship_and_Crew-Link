import { IconButton } from "@mui/material";
import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function createInfoSnackbar(message: string) {
  enqueueSnackbar(message, {
    variant: "info",
  });
}

export function createSuccessSnackbar(message: string) {
  enqueueSnackbar(message, {
    variant: "success",
  });
}
export function createWarningSnackbar(message: string) {
  enqueueSnackbar(message, {
    variant: "warning",
  });
}

export function createErrorSnackbar(message: string) {
  enqueueSnackbar(message, {
    variant: "error",
  });
}

export function useSnackbar() {
  return {
    info: createInfoSnackbar,
    success: createSuccessSnackbar,
    warning: createWarningSnackbar,
    error: createErrorSnackbar,
  };
}
