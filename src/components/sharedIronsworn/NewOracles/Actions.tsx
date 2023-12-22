import { Box } from "@mui/material";
import {
  OracleListItemActionProps,
  extraOracleListItemActionsProp,
} from "./oracleListItemActions";

export interface ActionsProps extends OracleListItemActionProps {
  actions?: extraOracleListItemActionsProp;
}

export function Actions(props: ActionsProps) {
  const { actions = [], ...actionProps } = props;

  if (actions.length === 0) {
    return null;
  }

  return (
    <Box ml={1}>
      {actions.map((Action, index) => (
        <Action key={index} {...actionProps} />
      ))}
    </Box>
  );
}
