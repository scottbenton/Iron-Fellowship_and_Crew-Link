import { Button, ButtonProps } from "@mui/material";
import { useRoller } from "stores/appState/useRoller";
import { useStore } from "stores/store";

export interface OracleButtonProps extends ButtonProps {
  oracleId: string;
}

export function OracleButton(props: OracleButtonProps) {
  const { oracleId, ...buttonProps } = props;

  const oracle = useStore(
    (store) => store.rules.oracleMaps.allOraclesMap[oracleId]
  );

  const shouldOracleRollBeGMSOnly = useStore(
    (store) => !store.characters.currentCharacter.currentCharacterId
  );

  const { rollOracleTableNew } = useRoller();

  if (!oracle || oracle.oracle_type === "tables") {
    return null;
  }
  return (
    <Button
      {...buttonProps}
      onClick={() =>
        rollOracleTableNew(oracleId, true, shouldOracleRollBeGMSOnly)
      }
    >
      {oracle.name}
    </Button>
  );
}
