import {
  posthogApiKey,
  posthogConfig,
  analyticsEnabled,
} from "config/posthog.config";
import { PostHogProvider } from "posthog-js/react";
import { PropsWithChildren } from "react";

export const AnalyticsProvider = (props: PropsWithChildren) => {
  if (analyticsEnabled) {
    return (
      <PostHogProvider apiKey={posthogApiKey} options={posthogConfig}>
        {props.children}
      </PostHogProvider>
    );
  }

  console.warn("Analytics are not enabled right now");
  return <>{props.children}</>;
};
