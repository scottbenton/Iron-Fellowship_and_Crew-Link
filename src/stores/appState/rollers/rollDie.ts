import { parseDiceExpression } from "./diceExpressionParser";
import { Dice } from "components/shared/Dice";
import { Theme } from "@mui/material";

export async function rollDie(diceExpression: string, theme: Theme, hide3dDice: boolean): Promise<number | undefined> {
  const parsedExpression = parseDiceExpression(diceExpression);
  if (!parsedExpression) {
    return undefined;
  } else if (hide3dDice) {
    let total = parsedExpression.modifier;
    for (let i = 0; i < parsedExpression.diceCount; i++) {
      total += Math.floor(Math.random() * parsedExpression.typeOfDice) + 1;
    }
    return total;
  } else {
    Dice.clear().show();
    setTimeout(() => Dice.hide("fade-out"), 100);

    const results = await Dice.roll([{
      qty: parsedExpression.diceCount,
      sides: parsedExpression.typeOfDice,
      themeColor: theme.palette.darkGrey.light
    }]);

    let total = parsedExpression.modifier;
    for (let i = 0; i < parsedExpression.diceCount; i++) {
      total += results[i].value;
    }
    return total;
  }
}
