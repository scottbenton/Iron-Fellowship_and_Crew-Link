import { useScrollTrigger } from "@mui/material";
import { useScrolledToBottom } from "./useScrolledToBottom";
import { useIsMobile } from "./useIsMobile";
import { useNewLayout } from "./featureFlags/useNewLayout";

export function useFooterState() {
  const newLayout = useNewLayout();
  const footerHeight = newLayout ? 64 : 56;

  const isMobile = useIsMobile();
  const trigger = useScrollTrigger();
  const isBottomOfPage = useScrolledToBottom();

  const isFooterVisible = isMobile && (!trigger || isBottomOfPage);

  return { isFooterVisible, footerHeight };
}
