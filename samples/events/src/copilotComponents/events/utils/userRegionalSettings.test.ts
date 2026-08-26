import { resolveUserRegionalSettings } from "./userRegionalSettings";

describe("resolveUserRegionalSettings", () => {
  it("uses SharePoint cultures and the browser time-zone", () => {
    expect(resolveUserRegionalSettings({
      browserLocale: "en-US",
      browserTimeZone: "Europe/Lisbon",
      dateLocale: "pt-PT",
      firstDayOfWeek: 1,
      uiLocale: "pt-PT",
    })).toEqual({
      dateLocale: "pt-PT",
      firstDayOfWeek: 1,
      timeZone: "Europe/Lisbon",
      uiLocale: "pt-PT",
    });
  });

  it("falls back safely when regional values are invalid", () => {
    const settings = resolveUserRegionalSettings({
      browserLocale: "not_a_locale",
      browserTimeZone: "not/a-time-zone",
      firstDayOfWeek: 9,
    });

    expect(settings.dateLocale).toBe("en-US");
    expect(settings.firstDayOfWeek).toBe(1);
    expect(settings.timeZone).toBe(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    expect(settings.uiLocale).toBe("en-US");
  });
});
