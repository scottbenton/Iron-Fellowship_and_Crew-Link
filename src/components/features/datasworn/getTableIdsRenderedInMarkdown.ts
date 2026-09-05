/**
 * Datasworn text places an oracle table inline with a directive, written either
 * as {{table>id}} or {{table:id}}. MarkdownRenderer turns those into the table,
 * so anything listing a move's oracles separately has to know which ones the
 * text has already drawn or the table renders twice.
 */
const TABLE_DIRECTIVE = /\{\{table[>:]([^}]+)\}\}/g;

/**
 * Drops the rules package from a Datasworn id, turning
 * "move.oracle_rollable:sundered_isles/suffer/withstand_damage.withstand_damage"
 * into "move.oracle_rollable:suffer/withstand_damage.withstand_damage".
 *
 * A move that replaces another can point its directive at the original's
 * oracle: Sundered Isles' Withstand Damage embeds the Starforged table while
 * carrying its own copy. Those are the same table to a reader, and comparing
 * the raw ids would draw it twice.
 */
export function withoutRulesPackage(id: string): string {
  const [objectType, path] = id.split(":");
  if (!path) {
    return id;
  }
  return `${objectType}:${path.split("/").slice(1).join("/")}`;
}

/** Package-independent ids of the tables this markdown already draws. */
export function getTableIdsRenderedInMarkdown(
  markdown: string | undefined
): Set<string> {
  const ids = new Set<string>();

  if (!markdown) {
    return ids;
  }

  for (const match of markdown.matchAll(TABLE_DIRECTIVE)) {
    ids.add(withoutRulesPackage(match[1]));
  }

  return ids;
}
