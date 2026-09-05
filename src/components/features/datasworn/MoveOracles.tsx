import { Datasworn } from "@datasworn/core";
import { Box, Stack, Typography } from "@mui/material";
import { OracleButton } from "../charactersAndCampaigns/OracleSection/OracleButton";
import { MoveOracleContent } from "./MoveOracleContent";

export interface MoveOraclesProps {
  oracles: Record<string, Datasworn.EmbeddedOracleRollable>;
}

/**
 * The oracle tables a move carries with it - Delve the Depths' Edge/Shadow/Wits
 * results, Ask the Oracle's odds. They used to render as a roll button alone,
 * which left no way to read the table.
 */
export function MoveOracles(props: MoveOraclesProps) {
  const { oracles } = props;

  const entries = Object.entries(oracles);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Box mt={2}>
      <Typography variant={"overline"}>
        Roll Oracle{entries.length > 1 ? "s" : ""}
      </Typography>
      <Stack spacing={2}>
        {entries.map(([key, oracle]) => (
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
