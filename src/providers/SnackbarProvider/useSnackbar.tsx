import { enqueueSnackbar } from "notistack";

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
    persist: true,
  });
}

export function createErrorSnackbar(message: string) {
  enqueueSnackbar(message, {
    variant: "error",
    persist: true,
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
