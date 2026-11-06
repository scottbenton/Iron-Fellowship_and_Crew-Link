/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { MemoryRouter, NavigateFunction, useNavigate } from "react-router-dom";
import {
  focusPageStart,
  useFocusMainOnNavigation,
} from "../useFocusMainOnNavigation";

// Lets React know act() is in use, so effects flush inside it.
(
  globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("focusPageStart", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("focuses the page's h1, making it focusable by script only", () => {
    document.body.innerHTML =
      "<main tabindex='-1'><h2>Section</h2><h1>Kira</h1></main>";
    const main = document.querySelector("main") as HTMLElement;

    const focused = focusPageStart(main);

    expect(focused.tagName).toBe("H1");
    expect(document.activeElement).toBe(focused);
    expect(focused.getAttribute("tabindex")).toBe("-1");
  });

  it("focuses main when the page has no h1", () => {
    document.body.innerHTML = "<main tabindex='-1'><p>Loading</p></main>";
    const main = document.querySelector("main") as HTMLElement;

    expect(focusPageStart(main)).toBe(main);
    expect(document.activeElement).toBe(main);
  });
});

describe("useFocusMainOnNavigation", () => {
  let container: HTMLDivElement;
  let root: Root;
  let navigate: NavigateFunction;

  function Page() {
    const mainRef = useRef<HTMLElement>(null);
    useFocusMainOnNavigation(mainRef);
    navigate = useNavigate();
    return (
      <>
        <a href={"/characters"}>Characters</a>
        <main ref={mainRef} tabIndex={-1}>
          <h1>Page</h1>
        </main>
      </>
    );
  }

  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(
        <MemoryRouter initialEntries={["/"]}>
          <Page />
        </MemoryRouter>
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  it("leaves focus alone on the first render", () => {
    expect(document.activeElement).toBe(document.body);
  });

  it("moves focus to the page heading when the path changes", () => {
    const link = container.querySelector("a") as HTMLElement;
    link.focus();

    act(() => navigate("/characters"));

    expect(document.activeElement?.tagName).toBe("H1");
  });

  it("ignores changes to the query string only", () => {
    const link = container.querySelector("a") as HTMLElement;
    link.focus();

    act(() => navigate("/?tab=notes"));

    expect(document.activeElement).toBe(link);
  });
});
