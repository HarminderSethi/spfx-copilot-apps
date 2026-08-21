import type { IZavaUser } from '../models/zavaEmployee';

export const isZavaManager = (user: IZavaUser): boolean =>
  /lead|manager|director|head/i.test(user.jobTitle || '');