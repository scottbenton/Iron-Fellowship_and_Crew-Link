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
 * table. Rendering it again here would show it twice, so those are left to the
 * markdown and only the roll button is added.
 */
export function MoveOracles(props: MoveOraclesProps) {
  const { move } = props;

  const oracles = Object.entries(move.oracles ?? {});
  const alreadyRendered = getTableIdsRenderedInMarkdown(move.text);

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
            {!alreadyRendered.has(withoutRulesPackage(oracle._id)) && (
              <MoveOracleContent oracle={oracle} />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
