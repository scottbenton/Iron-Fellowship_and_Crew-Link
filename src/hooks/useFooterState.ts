import { useScrollTrigger } from "@mui/material";
import { useScrolledToBottom } from "./useScrolledToBottom";

const FOOTER_HEIGHT = 56;

export function useFooterState() {
  const trigger = useScrollTrigger();
  const isBottomOfPage = useScrolledToBottom(FOOTER_HEIGHT);

  const isFooterVisible = !trigger || isBottomOfPage;

  return { isFooterVisible, footerHeight: FOOTER_HEIGHT };
}
