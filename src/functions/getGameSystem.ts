import { GAME_SYSTEMS } from "types/GameSystems.type";

const PROD_HOSTNAME_IRONSWORN = "iron-fellowship.scottbenton.dev";
const PROD_HOSTNAME_STARFORGED = "starforged-crew-link.scottbenton.dev";
const prodHostnames = [PROD_HOSTNAME_IRONSWORN, PROD_HOSTNAME_STARFORGED];

export function getGameSystem() {
  if (location.hostname === PROD_HOSTNAME_IRONSWORN) {
    return GAME_SYSTEMS.IRONSWORN;
  } else if (location.hostname === PROD_HOSTNAME_STARFORGED) {
    return GAME_SYSTEMS.STARFORGED;
  } else {
    return GAME_SYSTEMS.IRONSWORN;
  }
}

export function getIsProdEnvironment() {
  return prodHostnames.includes(location.hostname);
}
