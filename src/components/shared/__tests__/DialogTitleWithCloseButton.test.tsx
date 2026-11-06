/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
// The ESM build, so the dialog shares the DialogContext the title reads
// (the package root resolves to the CommonJS build under Node).
import Dialog from "@mui/material/Dialog/Dialog";
import { DialogTitleWithCloseButton } from "../DialogTitleWithCloseButton";

(
  globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("DialogTitleWithCloseButton", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
  });

  it("names the dialog with its title alone, not the buttons beside it", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        <Dialog open disablePortal>
          <DialogTitleWithCloseButton
            onClose={() => {}}
            actions={<button>Delete</button>}
          >
            Edit Clock
          </DialogTitleWithCloseButton>
        </Dialog>
      );
    });

    const dialog = container.querySelector("[role='dialog']");
    const labelId = dialog?.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();

    const labels = document.querySelectorAll(`[id='${labelId}']`);
    expect(labels).toHaveLength(1);
    expect(labels[0].tagName).toBe("H2");
    expect(labels[0].textContent).toBe("Edit Clock");
  });
});
