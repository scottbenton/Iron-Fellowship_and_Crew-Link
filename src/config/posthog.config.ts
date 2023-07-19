import { User } from "firebase/auth";
import { posthog, PostHogConfig } from "posthog-js";

export const posthogApiKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogApiHost = import.meta.env.VITE_POSTHOG_HOST;
export const analyticsEnabled = posthogApiHost && posthogApiKey;

export const posthogConfig: Partial<PostHogConfig> = {
  api_host: posthogApiHost,
  autocapture: {
    css_selector_allowlist: ["[ph-autocapture]"],
  },
  capture_pageview: false,
  capture_pageleave: false,
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
