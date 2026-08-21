/** Runs a promise without awaiting it, swallowing rejection instead of surfacing it as unhandled. */
export function fireAndForget(work: Promise<unknown>): void {
  work.catch(() => undefined);
}
