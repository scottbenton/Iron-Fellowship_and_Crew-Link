import { GAME_SYSTEMS } from "types/GameSystems.type";

const PROD_HOSTNAME_IRONSWORN = "iron-fellowship.scottbenton.dev";
const PROD_HOSTNAME_STARFORGED = "starforged-crew-link.scottbenton.dev";
const BETA_HOSTNAME_IRONSWORN = "beta.iron-fellowship.scottbenton.dev";
const BETA_HOSTNAME_STARFORGED = "beta.starforged-crew-link.scottbenton.dev";

const prodHostnames = [
  PROD_HOSTNAME_IRONSWORN,
  PROD_HOSTNAME_STARFORGED,
  BETA_HOSTNAME_IRONSWORN,
  BETA_HOSTNAME_STARFORGED,
];

const ironswornHostNames = [PROD_HOSTNAME_IRONSWORN, BETA_HOSTNAME_IRONSWORN];
const starforgedHostNames = [
  PROD_HOSTNAME_STARFORGED,
  BETA_HOSTNAME_STARFORGED,
];

const DEV_HOSTNAME_START_IRONSWORN = "iron-fellowship-dev";
const DEV_HOSTNAME_START_STARFORGED = "crew-link-dev";

export function getGameSystem() {
  let system: GAME_SYSTEMS = GAME_SYSTEMS.IRONSWORN;
  if (ironswornHostNames.includes(location.hostname)) {
    system = GAME_SYSTEMS.IRONSWORN;
  } else if (starforgedHostNames.includes(location.hostname)) {
    system = GAME_SYSTEMS.STARFORGED;
  } else if (location.hostname.startsWith(DEV_HOSTNAME_START_IRONSWORN)) {
    system = GAME_SYSTEMS.IRONSWORN;
  } else if (location.hostname.startsWith(DEV_HOSTNAME_START_STARFORGED)) {
    system = GAME_SYSTEMS.STARFORGED;
  }
  return system;
}

export function getIsProdEnvironment() {
  return prodHostnames.includes(location.hostname);
}

export function getIsLocalEnvironment() {
  return location.hostname === "localhost";
}
