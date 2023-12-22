import { useRouteError } from "react-router-dom";
import { EmptyState } from "./EmptyState";
import { useAppName } from "hooks/useAppName";
import { useEffect, useState } from "react";
import { reportPageError } from "lib/analytics.lib";

export function ErrorRoute() {
  const error = useRouteError();
  const [errorMessage, setErrorMessage] = useState<string>();

  const appName = useAppName();

  useEffect(() => {
    let errorMessage: string | undefined = undefined;
    let errorTrace: string | undefined = undefined;

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorTrace = error.stack;
    }

    if (
      errorMessage?.includes("Failed to fetch dynamically imported module") ||
      errorMessage
        ?.toLocaleLowerCase()
        .includes("error loading dynamically imported module")
    ) {
      window.location.reload();
    } else {
      setErrorMessage(errorMessage);
      reportPageError(
        errorMessage ?? "Could not extract error message.",
        errorTrace,
        location.pathname
      );
    }
  }, [error]);

  return (
    <EmptyState
      showImage
      title={"Error"}
      message={`${appName} failed to load the page properly. We are sorry for the inconvenience!${
        errorMessage && ` Full error message: ${errorMessage}`
      }`}
    />
  );
}
