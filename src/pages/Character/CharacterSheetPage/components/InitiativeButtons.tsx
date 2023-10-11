import { InitiativeStatusChip } from "components/features/characters/InitiativeStatusChip";
import { INITIATIVE_STATUS } from "types/Character.type";
import { useStore } from "stores/store";
import { useState } from "react";

export function InitiativeButtons() {
  const initiativeStatus = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.initiativeStatus ??
      INITIATIVE_STATUS.OUT_OF_COMBAT
  );

  const [loading, setLoading] = useState(false);
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateCharacterInitiative = (status: INITIATIVE_STATUS) => {
    setLoading(true);
    updateCharacter({ initiativeStatus: status })
      .catch()
      .finally(() => setLoading(false));
  };

  return (
    <InitiativeStatusChip
      status={initiativeStatus}
      handleStatusChange={(status) => updateCharacterInitiative(status)}
      loading={loading}
    />
  );
}
