import { resolveExpandedEventLayout } from "./eventLayout";

describe("resolveExpandedEventLayout", () => {
  it("uses feature when no layout was explicitly requested", () => {
    expect(
      resolveExpandedEventLayout({
        layout: "list",
        layoutWasExplicitlyRequested: false,
      }),
    ).toBe("feature");
  });

  it("uses feature for legacy arguments without the explicit-request flag", () => {
    expect(resolveExpandedEventLayout({ layout: "list" })).toBe("feature");
  });

  it("uses an explicitly requested layout", () => {
    expect(
      resolveExpandedEventLayout({
        layout: "list",
        layoutWasExplicitlyRequested: true,
      }),
    ).toBe("list");
  });

  it("maps the explicit compact-list value to the feed layout", () => {
    expect(
      resolveExpandedEventLayout({
        layout: "compactList",
        layoutWasExplicitlyRequested: true,
      }),
    ).toBe("minilist");
  });
});
