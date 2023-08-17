import {
  posthogApiKey,
  posthogConfig,
  analyticsEnabled,
} from "config/posthog.config";
import { User } from "firebase/auth";
import { posthog } from "posthog-js";
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

export function setAnalyticsUser(user: User) {
  if (!analyticsEnabled) return;
  posthog.identify(user.uid, { email: user.email });
}

export function clearAnalyticsUser() {
  if (!analyticsEnabled) return;

  posthog.reset();
}

export function sendPageViewEvent() {
  if (!analyticsEnabled) return;
  posthog.capture("$pageview");
}

export function reportApiError(
  errorMessage: string,
  underlyingErrorMessage?: string
) {
  if (!analyticsEnabled) return;
  posthog.capture("error-api", {
    message: errorMessage,
    underlyingErrorMessage,
  });
}
