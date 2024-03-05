import { DialogContent, Stack } from "@mui/material";
import { LinkedDialogContentTitle } from "../LinkedDialogContentTitle";
import { useStore } from "stores/store";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { OracleButton } from "components/features/charactersAndCampaigns/NewOracleSection/OracleButton";
import { MoveRollers } from "./MoveRollers";

export interface NewMoveDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function NewMoveDialogContent(props: NewMoveDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const moves = useStore((store) => store.rules.moveMaps.moveMap);
  const move = moves[id];

  if (!move) {
    return (
      <>
        <LinkedDialogContentTitle
          id={id}
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        >
          Move Not Found
        </LinkedDialogContentTitle>
        <DialogContent>Sorry, we could not find that move.</DialogContent>
      </>
    );
  }

  return (
    <>
      <LinkedDialogContentTitle
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      >
        {move.name}
      </LinkedDialogContentTitle>
      <DialogContent>
        <MoveRollers move={move} />
        <MarkdownRenderer markdown={move.text} />
        {move.oracles && (
          <Stack direction={"row"} flexWrap={"wrap"} spacing={2} mt={2}>
            {move.oracles.map((oracleId) => (
              <OracleButton
                color={"inherit"}
                variant={"outlined"}
                key={oracleId}
                oracleId={oracleId}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
    </>
  );
}
