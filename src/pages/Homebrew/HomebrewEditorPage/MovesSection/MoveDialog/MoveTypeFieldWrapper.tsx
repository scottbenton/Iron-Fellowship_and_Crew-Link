import { Control, useWatch } from "react-hook-form";
import { Form } from "./MoveDialogForm";
import { MoveType } from "types/homebrew/HomebrewMoves.type";
import { PropsWithChildren } from "react";

export interface MoveTypeFieldWrapperProps {
  control: Control<Form>;
  moveType: MoveType;
}

export function MoveTypeFieldWrapper(
  props: PropsWithChildren<MoveTypeFieldWrapperProps>
) {
  const { control, moveType, children } = props;

  const type = useWatch<Form>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "type",
    control,
  });

  if (type === moveType) {
    return <>{children}</>;
  }
  return <></>;
}
