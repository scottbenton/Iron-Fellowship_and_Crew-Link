import { useRouteError } from "react-router-dom";
import { EmptyState } from "./EmptyState";
import { useAppName } from "hooks/useAppName";

export function ErrorRoute() {
  const error = useRouteError();
  console.error(error);

  const appName = useAppName();

  return (
    <EmptyState
      showImage
      title={"Error"}
      message={`${appName} failed to load the page properly. We are sorry for the inconvenience!`}
    />
  );
}
