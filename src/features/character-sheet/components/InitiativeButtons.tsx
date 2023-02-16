import { useCharacterSheetUpdateCharacterInitiative } from "api/characters/updateCharacterInitiative";
import { InitiativeStatusChip } from "components/InitiativeStatusChip";
import { INITIATIVE_STATUS } from "types/Character.type";
import { useCharacterSheetStore } from "../characterSheet.store";

export function InitiativeButtons() {
  const initiativeStatus = useCharacterSheetStore(
    (store) =>
      store.character?.initiativeStatus ?? INITIATIVE_STATUS.OUT_OF_COMBAT
  );
  const { updateCharacterInitiative, loading } =
    useCharacterSheetUpdateCharacterInitiative();

  return (
    <>
      <InitiativeStatusChip
        status={initiativeStatus}
        handleStatusChange={(status) => updateCharacterInitiative(status)}
        loading={loading}
      />
    </>
  );
}
