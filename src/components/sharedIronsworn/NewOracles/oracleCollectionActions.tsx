import { OracleTablesCollection } from "@datasworn/core";
import { ReactElement } from "react";

export interface OracleCollectionActionProps {
  collection: OracleTablesCollection;
  disabled?: boolean;
}

export type extraOracleCollectionActionsProp = ((
  props: OracleCollectionActionProps
) => ReactElement)[];
