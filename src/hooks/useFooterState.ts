import { useScrollTrigger } from "@mui/material";
import { useScrolledToBottom } from "./useScrolledToBottom";
import { useIsMobile } from "./useIsMobile";

export function useFooterState() {
  const footerHeight = 64;

  const isMobile = useIsMobile();
  const trigger = useScrollTrigger();
  const isBottomOfPage = useScrolledToBottom();

  const isFooterVisible = isMobile && (!trigger || isBottomOfPage);

  return { isFooterVisible, footerHeight };
}
