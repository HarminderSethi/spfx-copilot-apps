import { validateEventQuery } from "./eventQuery";

describe("validateEventQuery", () => {
  it("accepts a complete valid query", () => {
    expect(
      validateEventQuery({
        startDateTime: "2026-08-25T00:00:00Z",
        endDateTime: "2026-08-31T23:59:59Z",
        searchQuery: " town hall ",
        siteUrl: "https://contoso.sharepoint.com/sites/HR/",
        maxEvents: 8,
      }),
    ).toEqual({
      rangeStart: Date.parse("2026-08-25T00:00:00Z"),
      rangeEnd: Date.parse("2026-08-31T23:59:59Z"),
      searchQuery: "town hall",
      siteUrl: "https://contoso.sharepoint.com/sites/HR",
      maxEvents: 8,
    });
  });

  it("rejects non-UTC date values", () => {
    expect(() =>
      validateEventQuery({ startDateTime: "2026-08-25" }),
    ).toThrow("startDateTime must be a UTC ISO 8601 date-time ending in Z.");
  });

  it("rejects impossible calendar values", () => {
    expect(() =>
      validateEventQuery({ startDateTime: "2026-02-30T00:00:00Z" }),
    ).toThrow("startDateTime contains an invalid UTC date-time.");
  });

  it("rejects reversed date ranges", () => {
    expect(() =>
      validateEventQuery({
        startDateTime: "2026-08-31T00:00:00Z",
        endDateTime: "2026-08-25T00:00:00Z",
      }),
    ).toThrow("endDateTime must not be earlier than startDateTime.");
  });

  it("rejects non-HTTPS site URLs", () => {
    expect(() =>
      validateEventQuery({ siteUrl: "http://contoso.sharepoint.com/sites/HR" }),
    ).toThrow("siteUrl must be an absolute HTTPS URL");
  });

  it("rejects non-SharePoint hostnames", () => {
    expect(() =>
      validateEventQuery({ siteUrl: "https://www.example.com/sites/HR" }),
    ).toThrow("siteUrl must use a SharePoint Online hostname.");
  });

  it("rejects event limits outside the supported range", () => {
    expect(() => validateEventQuery({ maxEvents: 51 })).toThrow(
      "maxEvents must be an integer from 1 through 50.",
    );
  });
});
