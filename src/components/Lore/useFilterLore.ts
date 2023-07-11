import { useSearch } from "hooks/useSearch";
import { useEffect, useState } from "react";
import { Lore } from "stores/sharedLocationStore";

export function useFilterLore(lore: { [key: string]: Lore }) {
  const { search, setSearch, debouncedSearch } = useSearch();

  const [filteredLore, setFilteredLore] = useState<{
    [key: string]: Lore;
  }>({});

  useEffect(() => {
    let tmpLore: { [key: string]: Lore } = {};
    Object.keys(lore).forEach((loreKey) => {
      const filteredLoreTags = (lore[loreKey].tags ?? []).filter((tag) =>
        tag.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      if (
        lore[loreKey].name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        filteredLoreTags.length > 0
      ) {
        tmpLore[loreKey] = lore[loreKey];
      }
    });

    setFilteredLore(tmpLore);
  }, [debouncedSearch, lore]);

  return { search, setSearch, filteredLore };
}
