import { Datasworn } from "@datasworn-community/core";
import { Box, Stack, Typography } from "@mui/material";
import { OracleButton } from "../charactersAndCampaigns/OracleSection/OracleButton";
import { MoveOracleContent } from "./MoveOracleContent";
import {
  getTableIdsRenderedInMarkdown,
  withoutRulesPackage,
} from "./getTableIdsRenderedInMarkdown";

export interface MoveOraclesProps {
  move: Datasworn.Move;
}

/**
 * The oracle tables a move carries with it - Delve the Depths' Edge/Shadow/Wits
 * results, Ask the Oracle's odds. They used to render as a roll button alone,
 * which left no way to read the table.
 *
 * Most moves that carry an oracle already place it themselves with a
 * {{table>...}} directive in their text, which MarkdownRenderer turns into the
 * table, with the roll button above it (getMoveTableAction). Those are left
 * out here, so neither the table nor its button shows twice.
 */
export function MoveOracles(props: MoveOraclesProps) {
  const { move } = props;

  const alreadyRendered = getTableIdsRenderedInMarkdown(move.text);
  const oracles = Object.entries(move.oracles ?? {}).filter(
    ([, oracle]) => !alreadyRendered.has(withoutRulesPackage(oracle._id))
  );

  if (oracles.length === 0) {
    return null;
  }

  return (
    <Box mt={2}>
      <Typography variant={"overline"}>
        Roll Oracle{oracles.length > 1 ? "s" : ""}
      </Typography>
      <Stack spacing={2}>
        {oracles.map(([key, oracle]) => (
          <Box key={key}>
            <OracleButton
              color={"inherit"}
              variant={"outlined"}
              oracleId={oracle._id}
            />
            <MoveOracleContent oracle={oracle} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
