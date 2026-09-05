import { Datasworn } from "@datasworn/core";
import { MoveRollers } from "../charactersAndCampaigns/LinkedDialog/LinkedDialogContent/MoveDialogContent/MoveRollers";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { MoveOracles } from "./MoveOracles";

interface MoveContentProps {
  move: Datasworn.Move;
}
export function MoveContent(props: MoveContentProps) {
  const { move } = props;
  return (
    <>
      <MoveRollers move={move} />
      <MarkdownRenderer markdown={move.text} />
      {move.oracles && <MoveOracles move={move} />}
    </>
  );
}
