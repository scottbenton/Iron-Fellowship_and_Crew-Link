import { useFeatureFlagEnabled } from "posthog-js/react";

export const useCanUploadWorldImages = () =>
  useFeatureFlagEnabled("can-upload-images-worlds") ?? false;
