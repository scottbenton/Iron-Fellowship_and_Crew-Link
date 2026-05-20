import { Datasworn } from "@datasworn/core";
import { MoveRollers } from "../charactersAndCampaigns/LinkedDialog/LinkedDialogContent/MoveDialogContent/MoveRollers";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { Box, Stack, Typography } from "@mui/material";
import { OracleButton } from "../charactersAndCampaigns/OracleSection/OracleButton";

interface MoveContentProps {
  move: Datasworn.Move;
}
export function MoveContent(props: MoveContentProps) {
  const { move } = props;
  return (
    <>
      <MoveRollers move={move} />
      <MarkdownRenderer markdown={move.text} />
      {move.oracles && Object.keys(move.oracles).length > 0 && (
        <Box mt={2}>
          <Typography variant={"overline"}>
            Roll Oracle{Object.keys(move.oracles).length > 1 ? "s" : ""}
          </Typography>
          <Stack direction={"row"} flexWrap={"wrap"} spacing={1}>
            {Object.entries(move.oracles).map(([oracleId, oracle]) => (
              <OracleButton
                color={"inherit"}
                variant={"outlined"}
                key={oracleId}
                oracleId={oracle._id}
              />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
}
