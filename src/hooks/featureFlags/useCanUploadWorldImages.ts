// import { useFeatureFlagEnabled } from "posthog-js/react";
// import { useStore } from "stores/store";

export const useCanUploadWorldImages = () => {
  /**
  const doAnyDocsHaveImages = useStore(
    (store) => store.worlds.currentWorld.doAnyDocsHaveImages
  );

  const isFeatureFlagEnabled =
    useFeatureFlagEnabled("can-upload-images-worlds") ?? false;
  const isLocal = location.hostname === "localhost";

  return doAnyDocsHaveImages || isLocal ? true : isFeatureFlagEnabled;
  */
  return true;
};
