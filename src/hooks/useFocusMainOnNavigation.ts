import { RefObject, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Moves focus to the start of a page: its first h1 when it has one, so a
 * screen reader announces the page by name, otherwise the main landmark.
 * Returns the element that was focused.
 */
export function focusPageStart(main: HTMLElement): HTMLElement {
  const heading = main.querySelector<HTMLElement>("h1");
  const target = heading ?? main;

  // A heading is not focusable by itself. tabIndex -1 lets a script focus it
  // without adding it to the tab order.
  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });

  return target;
}

/**
 * After a route change, moves focus into the main landmark, as a full page load
 * would reset it. Without this, focus stays on the link that was used (or is
 * lost with it), and a screen reader user is not told that the page changed.
 * Nothing happens on the first render, so a fresh page load keeps the
 * browser's own focus. Search and hash changes (tabs, dialogs) are ignored.
 */
export function useFocusMainOnNavigation(mainRef: RefObject<HTMLElement>) {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // Waits a frame so the new page has rendered its heading.
    const frame = requestAnimationFrame(() => {
      if (mainRef.current) {
        focusPageStart(mainRef.current);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, mainRef]);
}
