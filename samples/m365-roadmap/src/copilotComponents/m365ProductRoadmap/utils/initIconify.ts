import { addIcon, _api } from '@iconify/react';

/**
 * Pre-loads icons and disables the default Iconify CDN provider.
 *
 * The `ShowMessage` component from `@spteck/react-controls-v2` uses
 * `@iconify/react`'s `<Icon>` component with the name
 * `"fluent:error-circle-12-regular"` to render an error icon. When the
 * icon is not registered locally, `@iconify/react` falls back to fetching
 * it from `https://api.iconify.design`, which violates the SharePoint
 * Online Content Security Policy (CSP `connect-src` directive).
 *
 * Calling `addIcon` registers the icon in the local in-memory storage so
 * `@iconify/react` never attempts a network request. Disabling the default
 * API module via `_api.setAPIModule('', null)` ensures that any other
 * Iconify icons not explicitly registered locally will silently render as
 * an empty span instead of triggering another CSP-violating fetch.
 */
export const initIconify = (): void => {
  addIcon('fluent:error-circle-12-regular', {
    body:
      '<path fill="currentColor" d="M5.25 8.25a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.258-4.84a.5.5 0 0 1 .984 0l.008.09V6l-.008.09a.5.5 0 0 1-.984 0L5.5 6V3.5zM11 6A5 5 0 1 1 1 6a5 5 0 0 1 10 0m-1 0a4 4 0 1 0-8 0a4 4 0 0 0 8 0"/>',
    width: 12,
    height: 12,
  });

  // Disable the default Iconify API provider (api.iconify.design + fallbacks)
  // to guarantee no runtime fetch ever leaves the SharePoint origin and
  // triggers a CSP violation. The second argument is `null` to clear the
  // default fetch-based API module.
  (_api.setAPIModule as (provider: string, item: unknown) => void)(
    '',
    null
  );
};