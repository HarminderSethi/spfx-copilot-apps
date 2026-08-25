import type {
  ICopilotComponentHostContext,
  SPCopilotDisplayMode
} from '@microsoft/sp-copilot-component';
import type { MSGraphClientFactory } from '@microsoft/sp-http';
import type {
  PhotoAlbumLayout,
  PhotoAlbumPhoto
} from '@spteck/react-controls-v2/photo-album';

import type { IPhotosCopilotComponentProperties } from '../PhotosCopilotComponentProperties';

export interface IPhotosStrings {
  ErrorTitle: string;
  EmptyTitle: string;
  LoadingTitle: string;
  ExpandButtonLabel: string;
  CompactButtonLabel: string;
  MorePhotosLabel: string;
  AlbumAriaLabel: string;
}

export interface IPhotosGalleryPhoto extends PhotoAlbumPhoto {
  /** Direct image URL to try if the primary Graph thumbnail fails in the browser. */
  fallbackSrc?: string;
}

export interface IPhotosProps {
  /** Graph client factory used by the data hook. */
  graphClientFactory: MSGraphClientFactory;
  /** Copilot search arguments consumed by the data hook. */
  searchProperties: IPhotosCopilotComponentProperties;
  /** Requested gallery layout from the Copilot tool arguments. */
  layout: PhotoAlbumLayout;
  /** Host context (theme and display mode) from the Copilot host. */
  hostContext: ICopilotComponentHostContext;
  /** Request the host to change display mode (e.g. 'fullscreen'). */
  onRequestDisplayMode: (mode: SPCopilotDisplayMode) => Promise<void>;
  /**
   * Document the FluentProvider should inject its theme styles into. Pass
   * `domElement.ownerDocument` so Griffel writes CSS into the correct iframe
   * document rather than the top-level page.
   */
  targetDocument: Document | undefined;
  /** Localized strings for UI labels. */
  strings: IPhotosStrings;
}
