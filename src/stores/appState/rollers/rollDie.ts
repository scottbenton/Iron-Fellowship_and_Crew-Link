import { parseDiceExpression } from "./diceExpressionParser";
import { Theme } from "@mui/material";
import { rollDice } from "./rollDice";

export async function rollDie(diceExpression: string, theme: Theme, hide3dDice: boolean): Promise<number | undefined> {
  const parsedExpression = parseDiceExpression(diceExpression);
  if (!parsedExpression) {
    return undefined;
  }

  const values = await rollDice(
    [
      {
        qty: parsedExpression.diceCount,
        sides: parsedExpression.typeOfDice,
        themeColor: theme.palette.darkGrey.light,
      },
    ],
    !hide3dDice
  );

  return values.reduce((total, value) => total + value, parsedExpression.modifier);
}
