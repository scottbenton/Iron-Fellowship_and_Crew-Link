// @ts-expect-error no types
import DiceBox from "@3d-dice/dice-box";

const Dice = new DiceBox(
  "#dice-box",
  {
    id: "dice-canvas",
    assetPath: "/assets/dicebox/",
    gravity: 4,
    angularDamping: 0.6,
    linearDamping: 0.6,
    settleTimeout: 1500
  }
);

export { Dice };