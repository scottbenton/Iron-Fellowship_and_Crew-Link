import { dependencies } from "../../package.json";
export const dataswornVersion =
  (dependencies["@datasworn/core"].match(/[0-9]+\.[0-9]+\.[0-9]+/g) ?? [])[0] ??
  "0.0.0";
