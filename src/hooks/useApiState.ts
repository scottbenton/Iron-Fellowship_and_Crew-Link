import { useCallback, useState } from "react";
import { getErrorMessage } from "../functions/getErrorMessage";
import { useSnackbar } from "../providers/SnackbarProvider/useSnackbar";

export interface Config {
  disableErrorSnackbar?: boolean;
  defaultErrorMessage?: string;
}

export type ApiFunction<Params, ReturnType> = (
  params: Params
) => Promise<ReturnType>;

export function useApiState<Params, ReturnType>(
  apiFunction: ApiFunction<Params, ReturnType>,
  config?: Config
) {
  const [data, setData] = useState<ReturnType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const errorSnackbar = useSnackbar().error;

  const call = useCallback(
    (params: Params) =>
      new Promise<ReturnType>((resolve, reject) => {
        setLoading(true);
        apiFunction(params)
          .then((value) => {
            setData(value);
            setError(undefined);
            setLoading(false);
            resolve(value);
          })
          .catch((error) => {
            console.error(error);
            const errorMessage = getErrorMessage(
              error,
              config?.defaultErrorMessage ?? "Failed to fetch data"
            );
            if (!config?.disableErrorSnackbar) {
              errorSnackbar(errorMessage);
            }
            setData(undefined);
            setError(errorMessage);
            setLoading(false);

            reject(errorMessage);
          });
      }),
    [apiFunction, errorSnackbar, config]
  );

  return {
    call,
    data,
    loading,
    error,
  };
}
