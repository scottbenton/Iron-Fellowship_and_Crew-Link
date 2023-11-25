import { useEffect, useState } from "react";

export function useSearchNoState(search: string, debounceTime: number = 500) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [debounceTime, search]);
  return { debouncedSearch };
}

export function useSearch(debounceTime?: number) {
  const [search, setSearch] = useState("");
  const { debouncedSearch } = useSearchNoState(search, debounceTime);

  return { search, setSearch, debouncedSearch };
}
