import { describe, expect, it } from "vitest";
import {
  buildUniqueExportPath,
  createExportFilenameTracker,
  slugifyExportName,
} from "../exportFilename";

describe("slugifyExportName", () => {
  it("normalizes names into safe readable file stems", () => {
    expect(slugifyExportName("Café / The Old Keep!", "id-1")).toBe(
      "cafe-the-old-keep"
    );
  });

  it("falls back to a safe ID when the name has no usable characters", () => {
    expect(slugifyExportName("🎲🔥", "Fallback ID")).toBe("fallback-id");
  });
});

describe("buildUniqueExportPath", () => {
  it("appends an index for duplicate names within the same directory", () => {
    const tracker = createExportFilenameTracker();

    expect(
      buildUniqueExportPath({
        directory: "locations",
        name: "Haven",
        fallbackId: "loc-1",
        extension: "json",
        tracker,
      })
    ).toBe("locations/haven.json");
    expect(
      buildUniqueExportPath({
        directory: "locations",
        name: "Haven",
        fallbackId: "loc-2",
        extension: "json",
        tracker,
      })
    ).toBe("locations/haven-2.json");
  });
});
