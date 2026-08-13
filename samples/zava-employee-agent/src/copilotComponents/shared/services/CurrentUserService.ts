import type { IZavaUser } from '../models/zavaEmployee';

export interface ICurrentUserContext {
  pageContext: {
    user: {
      displayName: string;
      email: string;
      loginName: string;
      photoUrl?: string;
    };
    legacyPageContext?: {
      userPhotoUrl?: string;
      UserPhotoUrl?: string;
      userphoto?: string;
    };
  };
}

export const isCopilotWorkbenchUrl = (url: string | undefined): boolean =>
  typeof url === 'string' && /\/_layouts\/(?:15\/)?CopilotWorkbench\.aspx(?:[?#]|$)/i.test(url);

export const isUsableProfilePhoto = (photoUrl: string | undefined): boolean =>
  typeof photoUrl === 'string' && /^(?:data:image\/|blob:|https:\/\/)/i.test(photoUrl.trim());

export const getHostProfilePhoto = (context: ICurrentUserContext | undefined): string | undefined => {
  const candidates = [
    context?.pageContext.user.photoUrl,
    context?.pageContext.legacyPageContext?.userPhotoUrl,
    context?.pageContext.legacyPageContext?.UserPhotoUrl,
    context?.pageContext.legacyPageContext?.userphoto
  ];
  return candidates.find(isUsableProfilePhoto)?.trim();
};

/**
 * Resolves the signed-in identity synchronously without requesting a profile
 * photo. Real names and an already-provided photo come from page context;
 * visual fallback data is bundled and requires no profile-photo request.
 */
export const resolveCurrentUser = (
  context: ICurrentUserContext | undefined,
  fallback: IZavaUser,
  _hostUrl?: string
): IZavaUser => {
  const user = context?.pageContext.user;
  if (!user) {
    return fallback;
  }

  const displayName = user.displayName || user.loginName || fallback.displayName;
  const hostPhotoUrl = getHostProfilePhoto(context);
  const photoUrl = hostPhotoUrl || fallback.photoUrl;
  return {
    id: user.loginName || user.email || fallback.id,
    displayName,
    firstName: displayName.split(' ')[0] || displayName,
    email: user.email || fallback.email,
    jobTitle: fallback.jobTitle,
    department: fallback.department,
    photoUrl
  };
};