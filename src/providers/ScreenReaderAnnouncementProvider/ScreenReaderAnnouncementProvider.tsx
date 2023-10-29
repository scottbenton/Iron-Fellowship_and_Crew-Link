import { PropsWithChildren, useCallback, useState } from "react";
import { ScreenReaderAnnouncementContext } from "./ScreenReaderAnnouncementContext";
import { Box } from "@mui/material";

export function ScreenReaderAnnouncementProvider(props: PropsWithChildren) {
  const { children } = props;

  const [announcement, setAnnouncement] = useState<string | undefined>();

  const handleAnnouncement = useCallback((announcement: string) => {
    setAnnouncement((prevAnnouncement) =>
      announcement === prevAnnouncement ? announcement + " " : announcement
    );
  }, []);

  return (
    <ScreenReaderAnnouncementContext.Provider
      value={{ announcement, setAnnouncement: handleAnnouncement }}
    >
      <Box
        position={"absolute"}
        width={1}
        height={1}
        padding={0}
        m={-1}
        overflow={"hidden"}
        whiteSpace={"nowrap"}
        border={0}
        sx={{ clip: "rect(0, 0, 0, 0)" }}
        aria-live={"polite"}
        id={"live-announcement"}
      >
        {announcement}
      </Box>
      {children}
    </ScreenReaderAnnouncementContext.Provider>
  );
}
