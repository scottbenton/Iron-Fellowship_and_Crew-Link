import { useEffect, useState } from "react";

export function useSearchNoState(search: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);
  console.debug("AHH");
  return { debouncedSearch };
}

export function useSearch() {
  const [search, setSearch] = useState("");
  const { debouncedSearch } = useSearchNoState(search);

  return { search, setSearch, debouncedSearch };
}
