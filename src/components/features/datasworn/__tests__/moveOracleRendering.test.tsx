/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Datasworn, IdParser } from "@datasworn-community/core";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { getTableIdsRenderedInMarkdown } from "../getTableIdsRenderedInMarkdown";
import { MoveOracles } from "../MoveOracles";
import { withoutRulesPackage } from "../getTableIdsRenderedInMarkdown";
import { classic } from "@datasworn-community/ironsworn-classic";
import { delve } from "@datasworn-community/ironsworn-classic-delve";
import { lodestar } from "@datasworn-community/ironsworn-classic-lodestar";
import { starforged } from "@datasworn-community/starforged";
import { sundered_isles } from "@datasworn-community/sundered-isles";
import { starsmith } from "@datasworn-community/starsmith";
import { ironsmith } from "@datasworn-community/ironsmith";

const PACKAGES = [
  ["classic", classic],
  ["delve", delve],
  ["lodestar", lodestar],
  ["starforged", starforged],
  ["sundered isles", sundered_isles],
  ["starsmith", starsmith],
  ["ironsmith", ironsmith],
] as const;

IdParser.tree = Object.fromEntries(
  PACKAGES.map(([, rulesPackage]) => [rulesPackage._id, rulesPackage]),
);

function movesWithOracles(rulesPackage: Datasworn.RulesPackage) {
  return Object.values(rulesPackage.moves ?? {}).flatMap((category) =>
    Object.values(category.contents ?? {}).filter(
      (move) => Object.keys(move.oracles ?? {}).length > 0,
    ),
  );
}

describe("withoutRulesPackage", () => {
  it("drops the package so a replacement matches the original's table", () => {
    // Sundered Isles' Withstand Damage embeds the Starforged table.
    expect(
      withoutRulesPackage(
        "move.oracle_rollable:sundered_isles/suffer/withstand_damage.withstand_damage",
      ),
    ).toBe(
      withoutRulesPackage(
        "move.oracle_rollable:starforged/suffer/withstand_damage.withstand_damage",
      ),
    );
  });

  it("does not collapse genuinely different oracles", () => {
    expect(
      withoutRulesPackage("move.oracle_rollable:delve/delve/delve_the_depths.edge"),
    ).not.toBe(
      withoutRulesPackage("move.oracle_rollable:delve/delve/delve_the_depths.wits"),
    );
  });

  it("leaves an id with no package alone", () => {
    expect(withoutRulesPackage("not-an-id")).toBe("not-an-id");
  });
});

describe("getTableIdsRenderedInMarkdown", () => {
  it("finds the {{table>id}} form", () => {
    expect(
      getTableIdsRenderedInMarkdown(
        "Envision it.\n\n{{table>move.oracle_rollable:delve/delve/reveal_a_danger.reveal_a_danger}}",
      ),
    ).toEqual(
      // Normalized: the rules package is dropped.
      new Set(["move.oracle_rollable:delve/reveal_a_danger.reveal_a_danger"]),
    );
  });

  it("finds the {{table:id}} form", () => {
    expect(
      getTableIdsRenderedInMarkdown(
        "{{table:classic/oracles/action_and_theme/action}}",
      ),
    ).toEqual(new Set(["classic/oracles/action_and_theme/action"]));

    expect(
      getTableIdsRenderedInMarkdown(
        "{{table>oracle_rollable:classic/oracles/action_and_theme/action}}",
      ),
    ).toEqual(new Set(["oracle_rollable:oracles/action_and_theme/action"]));
  });

  it("ignores a plain link to the same oracle", () => {
    // A link is not a rendered table, so the table still needs drawing.
    expect(
      getTableIdsRenderedInMarkdown(
        "See [the odds](datasworn:move.oracle_rollable:classic/fate/ask_the_oracle.likely).",
      ).size,
    ).toBe(0);
  });

  it("handles prose and undefined text", () => {
    expect(getTableIdsRenderedInMarkdown("Just prose.").size).toBe(0);
    expect(getTableIdsRenderedInMarkdown(undefined).size).toBe(0);
  });
});

describe("each of a move's oracle tables is drawn exactly once", () => {
  /**
   * Renders what MoveContent puts on screen for a move: the markdown, then the
   * tables MoveOracles draws for the oracles the markdown did not.
   */
  function renderMoveBody(move: Datasworn.Move): string {
    return (
      renderToStaticMarkup(<MarkdownRenderer markdown={move.text} />) +
      renderToStaticMarkup(<MoveOracles move={move} />)
    );
  }

  function tableCount(html: string): number {
    return html.split("<table").length - 1;
  }

  /** Markdown tables written literally in the text, found by their header rule. */
  function proseTableCount(markdown: string): number {
    return markdown
      .split("\n")
      .filter((line) => /^[\s|:-]+$/.test(line) && line.includes("-") && line.includes("|"))
      .length;
  }

  it.each(PACKAGES)("in %s", (_label, json) => {
    const wrong: string[] = [];

    movesWithOracles(json).forEach((move) => {
      // One table per oracle the move carries - no more (the duplicate bug),
      // no fewer (the missing-table bug) - plus any plain markdown table the
      // text writes out itself, as Ask the Oracle's odds summary does.
      const expected =
        Object.keys(move.oracles ?? {}).length + proseTableCount(move.text);
      const actual = tableCount(renderMoveBody(move));

      if (actual !== expected) {
        wrong.push(`${move._id}: ${actual} tables, expected ${expected}`);
      }
    });

    expect(wrong).toEqual([]);
  });

  it("leaves Reveal a Danger's table to the markdown", () => {
    const move = movesWithOracles(delve).find(
      (m) => m._id === "move:delve/delve/reveal_a_danger_alt",
    );
    const oracleId = Object.values(move?.oracles ?? {})[0]._id;

    expect(getTableIdsRenderedInMarkdown(move?.text)).toContain(
      withoutRulesPackage(oracleId),
    );
  });

  it("draws Delve the Depths' three tables itself", () => {
    const move = movesWithOracles(delve).find(
      (m) => m._id === "move:delve/delve/delve_the_depths",
    );

    expect(getTableIdsRenderedInMarkdown(move?.text).size).toBe(0);
    expect(Object.keys(move?.oracles ?? {})).toHaveLength(3);
  });
});

describe("MarkdownRenderer leaves no directive on screen", () => {
  it.each(PACKAGES)("for every move in %s", (_label, rulesPackage) => {
    const leaked: string[] = [];

    Object.values(rulesPackage.moves ?? {}).forEach((category) =>
      Object.values(category.contents ?? {}).forEach((move) => {
        const html = renderToStaticMarkup(
          <MarkdownRenderer markdown={move.text} />,
        );
        if (html.includes("{{")) {
          leaked.push(`${move._id}: ${html.slice(html.indexOf("{{"), html.indexOf("{{") + 60)}`);
        }
      }),
    );

    expect(leaked).toEqual([]);
  });

  it("renders Delve the Depths without its table_columns directive", () => {
    const move = movesWithOracles(delve).find(
      (m) => m._id === "move:delve/delve/delve_the_depths",
    );
    const html = renderToStaticMarkup(
      <MarkdownRenderer markdown={move?.text ?? ""} />,
    );

    expect(html).not.toContain("table_columns");
    expect(html).toContain("traverse an area within a perilous site");
  });
});
