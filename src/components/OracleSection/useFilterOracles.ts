import { useEffect, useState } from "react";
import useSearch from "hooks/useSearch";
import { oracles } from "data/oracles";
import { Oracle } from "types/Oracles.type";

export function useFilterOracles() {
  const { setSearch, debouncedSearch } = useSearch();
  const [filteredOracles, setFilteredOracles] = useState(oracles);

  useEffect(() => {
    const results: Oracle[] = oracles
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
  }, [debouncedSearch]);

  return { setSearch, filteredOracles };
}
