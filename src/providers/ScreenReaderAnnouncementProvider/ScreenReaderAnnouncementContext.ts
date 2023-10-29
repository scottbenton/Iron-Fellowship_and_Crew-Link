import { createContext } from "react";

export interface IScreenReaderAnnouncementContext {
  announcement?: string;
  setAnnouncement: (announcement: string) => void;
}

export const ScreenReaderAnnouncementContext =
  createContext<IScreenReaderAnnouncementContext>({
    setAnnouncement: () => {},
  });
