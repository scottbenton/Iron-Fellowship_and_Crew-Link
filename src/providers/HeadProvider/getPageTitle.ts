/**
 * Builds a document title that names the page first, then the app, so a
 * screen reader announcing the title (or a list of tabs) leads with what is
 * different. A page without a name yet (still loading) gets the app name alone
 * rather than a title starting with a separator.
 */
export function getPageTitle(
  pageTitle: string | undefined | null,
  appTitle: string
): string {
  const trimmed = pageTitle?.trim();
  return trimmed ? `${trimmed} | ${appTitle}` : appTitle;
}
