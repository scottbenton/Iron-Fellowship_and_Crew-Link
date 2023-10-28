import { useContext } from "react";
import { ScreenReaderAnnouncementContext } from "./ScreenReaderAnnouncementContext";

export function useScreenReaderAnnouncement() {
  return useContext(ScreenReaderAnnouncementContext);
}
