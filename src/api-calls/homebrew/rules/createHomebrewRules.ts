import { Rules } from "@datasworn/core";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateHomebrewRules = createApiFunction<
  {
    homebrewId: string;
    rules: Rules;
  },
  void
>(() => {
  return new Promise((resolve, reject) => {
    resolve();
  });
}, "Failed to update rules.");
