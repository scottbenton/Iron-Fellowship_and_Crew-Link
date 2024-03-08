import { UseFormWatch } from "react-hook-form";
import { Form } from "../CharacterCreatePageContent";
import { useStore } from "stores/store";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useMemo } from "react";

export function useSyncHomebrewContent(
  watch: UseFormWatch<Form>,
  campaignId?: string
) {
  const expansionMap = watch("enabledExpansionMap", {});

  const expansions = useMemo(
    () =>
      Object.keys(expansionMap).filter(
        (expansionId) => expansionMap[expansionId]
      ),
    [expansionMap]
  );
  const campaignExpansions = useStore((store) =>
    campaignId
      ? store.campaigns.campaignMap[campaignId]?.expansionIds
      : undefined
  );

  useListenToHomebrewContent(
    (campaignId ? campaignExpansions : expansions) ?? []
  );
}
