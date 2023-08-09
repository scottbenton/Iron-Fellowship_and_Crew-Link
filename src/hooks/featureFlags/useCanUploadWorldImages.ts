import { useFeatureFlagEnabled } from "posthog-js/react";

export const useCanUploadWorldImages = () => {
  const isFeatureFlagEnabled =
    useFeatureFlagEnabled("can-upload-images-worlds") ?? false;
  const isLocal = location.hostname === "localhost";

  return isLocal ? true : isFeatureFlagEnabled;
};
