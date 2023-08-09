import { useEffect, useState } from "react";

export function useSearchNoState(search: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);
  return { debouncedSearch };
}

export function useSearch() {
  const [search, setSearch] = useState("");
  const { debouncedSearch } = useSearchNoState(search);

  return { search, setSearch, debouncedSearch };
}
