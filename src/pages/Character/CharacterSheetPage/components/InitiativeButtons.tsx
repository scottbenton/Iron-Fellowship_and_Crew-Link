import { InitiativeStatusChip } from "components/features/characters/InitiativeStatusChip";
import { INITIATIVE_STATUS } from "types/Character.type";
import { useStore } from "stores/store";

export function InitiativeButtons() {
  const initiativeStatus = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.initiativeStatus ??
      INITIATIVE_STATUS.OUT_OF_COMBAT
  );

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateCharacterInitiative = (status: INITIATIVE_STATUS) => {
    updateCharacter({ initiativeStatus: status }).catch();
  };

  return (
    <InitiativeStatusChip
      status={initiativeStatus}
      handleStatusChange={(status) => updateCharacterInitiative(status)}
    />
  );
}
