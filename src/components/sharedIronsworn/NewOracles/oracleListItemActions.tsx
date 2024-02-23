import { Datasworn } from "@datasworn/core";
import { ReactElement } from "react";

export interface OracleListItemActionProps {
  item:
    | Datasworn.OracleTableSharedRolls
    | Datasworn.OracleTableSharedResults
    | Datasworn.OracleTableSharedDetails
    | Datasworn.OracleRollable;
  disabled?: boolean;
}

export type extraOracleListItemActionsProp = ((
  props: OracleListItemActionProps
) => ReactElement)[];
