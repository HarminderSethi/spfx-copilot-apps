import { isEventsView } from "./eventView";

describe("isEventsView", () => {
  it.each(["events", "calendar"])("accepts the %s view", (view) => {
    expect(isEventsView(view)).toBe(true);
  });

  it("rejects unsupported view keys", () => {
    expect(isEventsView("agenda")).toBe(false);
  });
});
