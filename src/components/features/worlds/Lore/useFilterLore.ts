import { useSearchNoState } from "hooks/useSearch";
import { useMemo } from "react";
import { LoreDocumentWithGMProperties } from "stores/world/currentWorld/lore/lore.slice.type";

export function useFilterLore(
  lore: { [key: string]: LoreDocumentWithGMProperties },
  search: string
) {
  const { debouncedSearch } = useSearchNoState(search);

  const sortedLoreIds = useMemo(
    () =>
      Object.keys(lore).sort(
        (l1, l2) =>
          lore[l2].createdDate.getTime() - lore[l1].createdDate.getTime()
      ),
    [lore]
  );

  const filteredLoreIds = useMemo(() => {
    return sortedLoreIds.filter((loreId) => {
      const loreDoc = lore[loreId];
      const filteredLoreTags = (loreDoc.tags ?? []).filter((tag) =>
        tag.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      return (
        loreDoc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        filteredLoreTags.length > 0
      );
    });
  }, [sortedLoreIds, debouncedSearch, lore]);

  return { filteredLoreIds, sortedLoreIds };
}
