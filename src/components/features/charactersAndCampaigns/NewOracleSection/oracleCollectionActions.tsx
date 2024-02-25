import { Datasworn } from "@datasworn/core";
import { ReactElement } from "react";

export interface OracleCollectionActionProps {
  collection: Datasworn.OracleTablesCollection;
  disabled?: boolean;
}

export type extraOracleCollectionActionsProp = ((
  props: OracleCollectionActionProps
) => ReactElement)[];
