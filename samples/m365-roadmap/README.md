# M365 Product Roadmap

An SPFx 1.24 Copilot UX component for discovering Microsoft 365 roadmap features through the public Microsoft Release Communications MCP server.

## Experience

- Compact inline view with the first three roadmap cards and an expand action
- Fullscreen responsive card grid with native infinite scrolling
- Debounced search plus product picker, status dropdown, exact roadmap ID input, and multi-select release phase, platform, and cloud filters
- Lazy detail dialog with overview, rollout timeline, metadata, and Microsoft source links
- Loading skeletons, empty/error states, retry actions, light/dark themes, and Copilot host resizing
- Offset paging with item deduplication and stale-request protection

The interface uses `@spteck/react-controls-v2` for search, pickers, inputs, dropdowns, menus, buttons, cards, grid, dialog, timeline, loading, messages, layout, typography, and theme integration. Component styles use `@emotion/css` with Fluent design tokens.

## Data source

The MRC endpoint does not support direct browser access. The component therefore calls `ISPCopilotBridge.callServerToolAsync`, while the agent plugin registers the public MRC endpoint as an anonymous remote MCP runtime. The Copilot host performs the MCP network request outside the SharePoint iframe, avoiding browser CORS and `connect-src` restrictions.

Remote MCP endpoint:

`https://www.microsoft.com/releasecommunications/mcp`

It calls:

- `get_recent_m365_roadmaps` for search, OData filtering, facets, and paged results
- `get_m365_roadmap_by_id` for the full detail view

## Build

Requirements: Node.js 22.14 or newer within the supported Node 22 range.

```bash
npm install
npm run build
```

The production build generates:

- `sharepoint/solution/m365-product-roadmap.sppkg`
- `teams/m365-product-roadmap.zip`

For local Copilot Workbench development:

```bash
npm start
```

## Design artifacts

The implementation plan, interactive HTML prototype, and five UI mock images are in [`docs/m365-product-roadmap`](docs/m365-product-roadmap/README.md).

## Notes

- The MCP endpoint is public and does not require a Microsoft Graph permission grant.
- The generated agent package contains separate runtime mappings for the MRC tools and the tenant-hosted SPFx component tool.
- The SharePoint solution uses tenant-wide deployment.
- Fluent UI is retained only for host portal support and text-button primitives that are not available in `react-controls-v2`.

<img src="https://m365-visitor-stats.azurewebsites.net/spfx-copilot-components/samples/m365-roadmap" />