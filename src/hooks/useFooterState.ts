import { useScrollTrigger } from "@mui/material";
import { useScrolledToBottom } from "./useScrolledToBottom";
import { useIsMobile } from "./useIsMobile";

const FOOTER_HEIGHT = 56;

export function useFooterState() {
  const isMobile = useIsMobile();
  const trigger = useScrollTrigger();
  const isBottomOfPage = useScrolledToBottom();

  const isFooterVisible = isMobile && (!trigger || isBottomOfPage);

  return { isFooterVisible, footerHeight: FOOTER_HEIGHT };
}
