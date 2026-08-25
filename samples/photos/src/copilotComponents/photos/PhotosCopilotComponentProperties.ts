/**
 * Properties schema for this Copilot Component.
 *
 * This schema is defined with Zod and exported as JSON Schema via
 * `zod-to-json-schema`. The manifest references the compiled `.js` default
 * export, which the Copilot host uses to validate and describe the tool
 * arguments that Copilot passes when invoking this component.
 *
 * To add more properties, extend the `z.object({...})` below — they will
 * automatically appear as tool parameters in the Copilot UI.
 */
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const propertiesSchema = z.object({
  searchQuery: z.string().optional().describe(
    'Optional words or natural-language request describing the photo subject, event, campaign, person, season, filename, or library to find. Examples: "summer fest", "team offsite", or "all photos in the Company Global Event library". Common request words are normalized before searching.'
  ),
  siteUrl: z.string().optional().describe(
    'Optional absolute SharePoint site URL to search, for example https://contoso.sharepoint.com/sites/Marketing. Only provide this when the user names or supplies the site; never invent a URL.'
  ),
  libraryName: z.string().optional().describe(
    'Optional display name of the SharePoint document library, for example Events or Marketing Photos. Use when the user refers to a library by name.'
  ),
  libraryUrl: z.string().optional().describe(
    'Optional absolute URL of the SharePoint document library root. Prefer this over libraryName when the user provides a library link because it gives the most precise scope.'
  ),
  folderPath: z.string().optional().describe(
    'Optional absolute SharePoint folder URL. Use when the user asks for photos in a specific folder or album inside a library.'
  ),
  includeOneDrivePhotos: z.boolean().optional().describe(
    'Optional search-scope flag. Set true when the user asks for "my photos", "OneDrive photos", or provides a personal OneDrive URL; set false only when the user explicitly asks to exclude OneDrive. Omit otherwise. By default, personal OneDrive results from hosts ending in -my.sharepoint.com are excluded.'
  ),
  startDateTime: z.string().optional().describe(
    'Optional inclusive start of a photo date range in ISO 8601 format. Use for requests such as photos from last summer or from June 2025; convert relative dates to explicit UTC values.'
  ),
  endDateTime: z.string().optional().describe(
    'Optional inclusive end of a photo date range in ISO 8601 format. Use together with startDateTime for a bounded date range.'
  ),
  layout: z.enum(['rows', 'columns', 'masonry']).optional().describe(
    'Optional gallery layout. Use columns for the default balanced gallery, masonry for mixed portrait and landscape photos, and rows for a compact strip. The component defaults to columns and always provides the PhotoAlbum lightbox.'
  ),
  maxPhotos: z.number().int().optional().describe(
    'Optional maximum number of photos to show. Use 1–1000 for a specific limit; omit it or use 0 to allow the component to load up to the Microsoft Graph Search limit of 1000 photos as the user scrolls.'
  ),
  sortBy: z.enum(['relevance', 'modified', 'name']).optional().describe(
    'Optional ordering. Use relevance for topic searches, modified for newest or recently updated photos, and name for alphabetical results.'
  )
});

export type IPhotosCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default zodToJsonSchema(propertiesSchema);
