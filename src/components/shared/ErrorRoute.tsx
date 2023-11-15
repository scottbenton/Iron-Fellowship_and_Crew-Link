import { useRouteError } from "react-router-dom";
import { EmptyState } from "./EmptyState";
import { useAppName } from "hooks/useAppName";
import { useEffect } from "react";
import { reportPageError } from "lib/analytics.lib";

export function ErrorRoute() {
  const error = useRouteError();
  console.error(error);

  const appName = useAppName();

  useEffect(() => {
    if (typeof error === "string") {
      reportPageError(error, undefined, location.pathname);
    } else if (error instanceof Error) {
      reportPageError(error.message, error.stack, location.pathname);
    } else {
      reportPageError(
        "Could not extract error message",
        undefined,
        location.pathname
      );
    }
  }, [error]);

  return (
    <EmptyState
      showImage
      title={"Error"}
      message={`${appName} failed to load the page properly. We are sorry for the inconvenience!`}
    />
  );
}
