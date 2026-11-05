import { useEffect } from "react";
import { useStore } from "stores/store";

// How long typing has to pause before the number of results is read out, so
// a screen reader is not interrupted after every letter.
const ANNOUNCE_DELAY_MS = 750;

export function getSearchResultsText(
  count: number,
  singular: string,
  plural: string
): string {
  if (count === 0) {
    return `No ${plural} found`;
  }
  return `${count} ${count === 1 ? singular : plural} found`;
}

/**
 * Reads out how many results a filter shows once typing in it settles. A
 * filtered list changes silently, so without this a screen reader user has
 * to go looking to learn whether anything matched.
 */
export function useAnnounceSearchResults(
  search: string,
  count: number,
  singular: string,
  plural: string
) {
  const announce = useStore((store) => store.appState.announce);

  useEffect(() => {
    if (!search) {
      return;
    }
    const timeout = setTimeout(
      () => announce(getSearchResultsText(count, singular, plural)),
      ANNOUNCE_DELAY_MS
    );
    return () => clearTimeout(timeout);
  }, [announce, search, count, singular, plural]);
}
