import { Box } from "@mui/material";
import {
  OracleCollectionActionProps,
  extraOracleCollectionActionsProp,
} from "./oracleCollectionActions";

export interface CollectionActionsProps extends OracleCollectionActionProps {
  collectionActions?: extraOracleCollectionActionsProp;
}

export function CollectionActions(props: CollectionActionsProps) {
  const { collectionActions = [], ...actionProps } = props;

  if (collectionActions.length === 0) {
    return null;
  }

  return (
    <Box>
      {collectionActions.map((Action, index) => (
        <Action key={index} {...actionProps} />
      ))}
    </Box>
  );
}
