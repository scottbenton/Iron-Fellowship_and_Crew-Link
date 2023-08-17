import { getErrorMessage } from "functions/getErrorMessage";
import { reportApiError } from "lib/analytics.lib";
import { createErrorSnackbar } from "providers/SnackbarProvider";

export type ApiFunction<Params, ReturnType> = (
  params: Params
) => Promise<ReturnType>;

export function createApiFunction<Params, Result>(
  apiFunction: ApiFunction<Params, Result>,
  friendlyErrorMessage: string
): ApiFunction<Params, Result> {
  return (params: Params) =>
    new Promise((resolve, reject) => {
      apiFunction(params)
        .then(resolve)
        .catch((e) => {
          console.error(e);
          const apiErrorMessage = getErrorMessage(e, friendlyErrorMessage);
          reportApiError(friendlyErrorMessage, apiErrorMessage);
          createErrorSnackbar(friendlyErrorMessage);
          reject(e);
        });
    });
}
