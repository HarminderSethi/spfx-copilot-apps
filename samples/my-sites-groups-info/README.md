# my-sites-groups-info

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.24.0--beta.2-yellow.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| folder name | Author details (name, company, twitter alias with link) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  # My Sites & Groups Info - Interactive Microsoft 365 resources in Copilot

  ## Summary

  **My Sites & Groups Info** is an SPFx **Copilot Component** that helps users discover and manage their SharePoint sites and Microsoft 365 Groups without leaving Microsoft 365 Copilot.

  A declarative agent calls the `MySitesGroupInfoTool`, which renders a live React experience directly in the Copilot conversation. Depending on the user's request, the component can show followed SharePoint sites, accessible SharePoint sites, or Microsoft 365 Groups the user belongs to.

  From the rendered experience, users can:

  - Browse followed and accessible SharePoint sites
  - Search sites and groups by name, URL, ID, email address, or description
  - Open SharePoint sites directly
  - Follow or unfollow SharePoint sites
  - Explore Microsoft 365 Group owners and members
  - Search for users and add group members when permitted
  - Remove group members when permitted
  - Refresh the live results or expand the component to fullscreen

  This sample demonstrates how Copilot can move beyond returning information in text and provide an interactive, permission-aware experience where users can complete tasks in context.

  ## Compatibility

  ![SPFx 1.24.0-beta.2](https://img.shields.io/badge/SPFx-1.24.0--beta.2-green.svg)
  ![Node.js v22](https://img.shields.io/badge/Node.js-v22-green.svg)
  ![Compatible with SharePoint Online](https://img.shields.io/badge/SharePoint%20Online-Compatible-green.svg)
  ![Compatible with Microsoft 365 Copilot](https://img.shields.io/badge/Microsoft%20365%20Copilot-Compatible-green.svg)

  ## Applies to

  - [SharePoint Framework](https://learn.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview) 1.24+ (Copilot Component)
  - [Microsoft 365 Copilot extensibility](https://learn.microsoft.com/microsoft-365-copilot/extensibility/)
  - [Microsoft 365 tenant](https://learn.microsoft.com/sharepoint/dev/spfx/set-up-your-development-environment) with the SharePoint App Catalog

  > Get your own free development tenant by subscribing to the [Microsoft 365 Developer Program](https://aka.ms/m365/devprogram).

  ## Contributors

  - [Harminder Singh](https://github.com/HarminderSethi)

  ## Version history

  | Version | Date | Comments |
  | ------- | ---- | -------- |
  | 1.0.7.0 | 2026-08-25 | Initial release |

  ## Prerequisites

  This solution uses Microsoft Graph to read SharePoint sites and Microsoft 365 Groups, and to manage group membership. The permissions declared in [`config/package-solution.json`](./config/package-solution.json) must be approved by a tenant administrator:

  | Permission | Why it is needed |
  | ---------- | ---------------- |
  | `Sites.Read.All` | Read SharePoint site information available to the user. |
  | `Group.Read.All` | Read Microsoft 365 Group information. |
  | `GroupMember.ReadWrite.All` | Add and remove group members when the user is authorized. |
  | `Directory.Read.All` | Resolve users and group membership details. |
  | `People.Read` | Search for people when adding group members. |

  `Files.Read.All` is also declared by the solution for Microsoft Graph access scenarios supported by the package configuration.

  After deploying the `.sppkg` to the App Catalog, a tenant administrator must approve the requested permissions in **SharePoint Admin Center > Advanced > API access**. Permission changes require approval again before they take effect.

  ## Minimal path to awesome

  - Clone this repository
  - From your command line, change your current directory to this solution's root
  - Install the dependencies:

  ```bash
  npm install
  ```

  - Start the hosted tenant workbench:

  ```bash
  npm run start
  ```

  SPFx Copilot Components cannot be tested in the local workbench. Use a hosted SharePoint tenant workbench and a tenant where the Copilot component solution is deployed.

  To create the production package, run:

  ```bash
  npm run build
  ```

  Deploy `sharepoint/solution/my-sites-groups-info.sppkg` to the SharePoint App Catalog, approve the API permissions, and install the solution before invoking the **My Sites and Groups Info Agent** in Microsoft 365 Copilot.

  Other build commands can be listed using `heft --help`.

  ## Features

  This sample illustrates the following concepts:

  - **Copilot Component UX** - A component with `copilotType: "Ux"` exposes `MySitesGroupInfoTool` as a tool that a declarative agent can invoke to render a custom React experience inside Copilot.
  - **Zod-based tool properties schema** - The `target`, `top`, and `query` arguments are defined with Zod and exported as JSON Schema for Copilot tool invocation.
  - **Multiple resource views** - The same component supports followed sites, accessible sites, and Microsoft 365 Groups through the `target` argument.
  - **Brokered Microsoft Graph access** - Graph requests use the SPFx-provided `MSGraphClientV3` client without manual token handling.
  - **SharePoint REST access** - Accessible sites are discovered through the SharePoint Search REST API, with a SharePoint Social API fallback for followed sites when Graph is unavailable.
  - **In-context actions** - Users can follow or unfollow sites and add or remove group members from the rendered experience when the required permissions allow it.
  - **Permission-aware membership management** - Group membership actions are enabled only when the signed-in user is recognized as an owner and the tenant permissions allow the operation.
  - **Display-mode-aware rendering** - The component supports compact inline rendering and fullscreen rendering and can request a size change from the Copilot host.
  - **Fluent UI React experience** - The interface uses Fluent UI v9 components, icons, and design tokens.
  - **Live refresh and error handling** - Results can be refreshed, and data or action failures are shown in the component instead of being fabricated by the agent.

  ## Help

  If you encounter issues using this solution, please [open an issue](https://github.com/pnp/spfx-copilot-apps/issues) in the repository.

  ## Disclaimer

  **THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**