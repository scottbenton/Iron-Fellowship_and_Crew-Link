import { useEffect, useState } from "react";
import useSearch from "hooks/useSearch";
import { Oracle } from "types/Oracles.type";

export function useFilterOracles(defaultOracles: Oracle[]) {
  const { search, setSearch, debouncedSearch } = useSearch();
  const [filteredOracles, setFilteredOracles] = useState(defaultOracles);

  useEffect(() => {
    const results: Oracle[] = defaultOracles
      .filter(
        (oracleCategory) =>
          oracleCategory.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          oracleCategory.sections.filter((section) =>
            section.sectionName
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase())
          ).length > 0
      )
      .map((oracleCategory) => {
        return {
          name: oracleCategory.name,
          sections: oracleCategory.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
            ? oracleCategory.sections
            : oracleCategory.sections.filter((section) =>
                section.sectionName
                  .toLowerCase()
                  .includes(debouncedSearch.toLowerCase())
              ),
        };
      });
    setFilteredOracles(results);
  }, [debouncedSearch, defaultOracles]);

  return { search, setSearch, filteredOracles };
}
