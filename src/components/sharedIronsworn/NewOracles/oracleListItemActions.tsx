import {
  OracleRollable,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
} from "@datasworn/core";
import { ReactElement } from "react";

export interface OracleListItemActionProps {
  item:
    | OracleTableSharedRolls
    | OracleTableSharedResults
    | OracleTableSharedDetails
    | OracleRollable;
  disabled?: boolean;
}

export type extraOracleListItemActionsProp = ((
  props: OracleListItemActionProps
) => ReactElement)[];
