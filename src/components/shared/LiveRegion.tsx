import { ScreenReaderOnly } from "./ScreenReaderOnly";
import { useScreenReaderAnnouncement } from "./useScreenReaderAnnouncement";

export interface LiveRegionProps {
  id?: string;
}

/**
 * Reads announce() messages out to screen readers.
 *
 * While a dialog or drawer is open, MUI hides everything outside it from
 * screen readers, including the app's own LiveRegion. So every dialog and
 * drawer renders one of these inside itself as well. Only one is ever exposed
 * at a time, because a closed or covered one is hidden the same way.
 */
export function LiveRegion(props: LiveRegionProps) {
  const { id } = props;
  const announcement = useScreenReaderAnnouncement();

  return (
    <ScreenReaderOnly live id={id}>
      {announcement}
    </ScreenReaderOnly>
  );
}
