import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useContinueUrl() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectWithContinueUrl = useCallback(
    (nextPath: string) => {
      const pathname = window.location.pathname;

      const params = new URLSearchParams();
      params.append("continue", pathname);

      navigate(nextPath + "?" + params.toString());
    },
    [navigate]
  );

  const navigateToContinueURL = useCallback(
    (fallbackPath: string) => {
      navigate(searchParams.get("continue") || fallbackPath);
    },
    [searchParams]
  );

  return {
    redirectWithContinueUrl,
    navigateToContinueURL,
  };
}
