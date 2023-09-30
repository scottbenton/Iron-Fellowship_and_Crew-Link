import { useRouteError } from "react-router-dom";
import { EmptyState } from "./EmptyState";

export function ErrorRoute() {
  const error = useRouteError();
  console.error(error);

  return (
    <EmptyState
      imageSrc="/assets/error.svg"
      title={"Error"}
      message="Iron Fellowship failed to load the page properly. We are sorry for the inconvenience!"
    />
  );
}
