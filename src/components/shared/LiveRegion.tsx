import { useStore } from "stores/store";
import { ScreenReaderOnly } from "./ScreenReaderOnly";

export function LiveRegion() {
  const announcement = useStore(
    (store) => store.appState.screenReaderAnnouncement
  );

  return (
    <ScreenReaderOnly live id={"live-region"}>
      {announcement}
    </ScreenReaderOnly>
  );
}
