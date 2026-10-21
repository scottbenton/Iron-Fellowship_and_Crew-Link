import { useId } from "react";

/**
 * Returns a document-unique id for referencing an element inside an inline SVG,
 * such as a clipPath or mask.
 *
 * Icon components get rendered many times on a page, so a hardcoded id ends up
 * duplicated across every instance. `url(#id)` resolves to the first match in
 * document order, which means every copy shares one element. If that element
 * happens to sit in a `display: none` subtree it has no layout box, and both
 * Gecko and Blink silently drop the clip or mask for every instance at once.
 *
 * React's useId wraps its value in colons, which are awkward inside a FuncIRI
 * and invalid in a CSS selector, so they are stripped.
 */
export function useSvgId(prefix: string): string {
  const id = useId().replace(/:/g, "");
  return `${prefix}-${id}`;
}
