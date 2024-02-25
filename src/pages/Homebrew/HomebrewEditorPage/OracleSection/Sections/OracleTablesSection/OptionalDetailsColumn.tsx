import { PropsWithChildren } from "react";
import { Control, useWatch } from "react-hook-form";

interface DetailsField {
  showDetails?: boolean;
}

export interface OptionalDetailsColumnProps<T extends DetailsField> {
  control: Control<T>;
}

export function OptionalDetailsColumn<T extends DetailsField>(
  props: PropsWithChildren<OptionalDetailsColumnProps<T>>
) {
  const { control, children } = props;

  const showDetails =
    useWatch<T>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: "showDetails" as any,
      control,
    }) ?? false;

  if (!showDetails) {
    return null;
  } else {
    return <>{children}</>;
  }
}
