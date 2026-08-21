export interface ICurrentUserContext {
  pageContext: {
    user: {
      displayName?: string;
      email?: string;
      loginName?: string;
      photoUrl?: string;
    };
    legacyPageContext?: {
      userPhotoUrl?: string;
      UserPhotoUrl?: string;
      userphoto?: string;
    };
  };
}

export interface IResolvedCurrentUser {
  displayName: string;
  photoUrl?: string;
}

const isUsablePhoto = (value: string | undefined): boolean =>
  typeof value === 'string' && /^(?:data:image\/|blob:|https:\/\/)/i.test(value.trim());

export const resolveCurrentUser = (context: ICurrentUserContext | undefined): IResolvedCurrentUser => {
  const user = context?.pageContext.user;
  const candidates = [
    user?.photoUrl,
    context?.pageContext.legacyPageContext?.userPhotoUrl,
    context?.pageContext.legacyPageContext?.UserPhotoUrl,
    context?.pageContext.legacyPageContext?.userphoto
  ];
  return {
    displayName: user?.displayName || user?.loginName || 'Megan Bowen',
    photoUrl: candidates.find(isUsablePhoto)?.trim()
  };
};