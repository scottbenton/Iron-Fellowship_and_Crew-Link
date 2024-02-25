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

    // The App has updated in the background, lets grab the new versions of the pages by refreshing
    if (
      errorMessage?.includes("Failed to fetch dynamically imported module") ||
      errorMessage?.includes(
        "'text/html' is not a valid JavaScript MIME type."
      ) ||
      errorMessage?.includes("Importing a module script failed.") ||
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

  if (!errorMessage) {
    return null;
  }

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
