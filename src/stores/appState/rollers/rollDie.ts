import { parseDiceExpression } from "./diceExpressionParser";

export function rollDie(diceExpression: string): number | undefined {
  const parsedExpression = parseDiceExpression(diceExpression);
  if (!parsedExpression) {
    return undefined;
  } else {
    let total = parsedExpression.modifier;
    for (let i = 0; i < parsedExpression.diceCount; i++) {
      total += Math.floor(Math.random() * parsedExpression.typeOfDice) + 1;
    }
    return total;
  }
}
