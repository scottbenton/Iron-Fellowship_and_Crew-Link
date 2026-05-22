import { Datasworn } from "@datasworn/core";
import { ListItemText } from "@mui/material";
import { CATEGORY_VISIBILITY } from "./useFilterOracles";
import { useRoller } from "stores/appState/useRoller";
import { OracleListItemActionOpenDialogButton } from "./OracleListItemActionOpenDialogButton";
import { ListItemButtonWithSecondaryAction } from "./ListItemButtonWithSecondaryAction";
import { ToggleVisibilityButton } from "components/shared/ToggleVisibilityButton";
import { useStore } from "stores/store";
import { useState } from "react";

export interface OracleListItemProps {
  oracleId: string;
  oracles: Record<string, Datasworn.OracleRollable>;
  visibleOracles: Record<string, boolean>;
  disabled?: boolean;
  collectionVisibility?: CATEGORY_VISIBILITY;
  actionIsHide?: boolean;
  hidden?: boolean;
}

export function OracleListItem(props: OracleListItemProps) {
  const { oracleId, oracles, visibleOracles, disabled, collectionVisibility, actionIsHide, hidden } =
    props;
  const oracle = oracles[oracleId];
  const { rollOracleTable } = useRoller();

  const updateHiddenOracles = useStore(
    (store) => store.campaigns.currentCampaign.updateHiddenOracles
  );

  const [hideIsloading, setHideIsLoading] = useState(false);

  const onToggleVisibility = () => {
    setHideIsLoading(true);
    updateHiddenOracles(oracleId, !hidden)
      .catch(() => {
      })
      .finally(() => {
        setHideIsLoading(false);
      });
  };

  if(!actionIsHide && hidden) {
    return null;
  }

  if (
    (collectionVisibility !== CATEGORY_VISIBILITY.ALL &&
      !visibleOracles[oracleId]) ||
    !oracle
  ) {
    return null;
  }

  return (
    <ListItemButtonWithSecondaryAction
      secondaryAction={
        <>
          <OracleListItemActionOpenDialogButton
            item={oracle}
            disabled={disabled}
          />
          {actionIsHide && (
            <ToggleVisibilityButton
              onToggleVisibility={onToggleVisibility}
              loading={hideIsloading}
              hidden={hidden}
            />
          )}
        </>
      }
      disabled={disabled}
      onClick={!actionIsHide ? () => rollOracleTable(oracle._id, true, false) : undefined}
      sx={{
        filter: hidden ? "grayscale(30%) opacity(70%)" : undefined
      }}
    >
      <ListItemText primary={oracle.name} />
    </ListItemButtonWithSecondaryAction>
  );
}
