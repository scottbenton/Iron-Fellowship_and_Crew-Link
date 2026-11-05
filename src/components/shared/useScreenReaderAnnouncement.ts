import { useEffect, useRef, useState } from "react";
import { useStore } from "stores/store";

// How long a live region stays empty between two messages. Screen readers only
// read a live region when its text changes, so a message that repeats the last
// one (the same oracle result twice) has to be cleared and written again.
const CLEAR_DELAY_MS = 100;

/**
 * The text a live region should hold. It starts empty, so a region mounted
 * after a roll does not read that roll again, and it is cleared and rewritten
 * for every announce() call, including one that repeats the previous message.
 */
export function useScreenReaderAnnouncement(): string | undefined {
  const announcement = useStore(
    (store) => store.appState.screenReaderAnnouncement
  );
  const announcementId = useStore(
    (store) => store.appState.screenReaderAnnouncementId
  );

  const [text, setText] = useState<string>();
  const mountedIdRef = useRef(announcementId);

  useEffect(() => {
    if (announcementId === mountedIdRef.current) {
      return;
    }
    setText(undefined);
    const timeout = setTimeout(() => setText(announcement), CLEAR_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [announcement, announcementId]);

  return text;
}
