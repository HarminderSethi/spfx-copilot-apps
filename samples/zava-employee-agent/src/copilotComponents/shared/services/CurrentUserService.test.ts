import { embeddedImages } from '../mockData/embeddedImages';
import { MockZavaEmployeeDataService } from './MockZavaEmployeeDataService';
import {
  getHostProfilePhoto,
  isCopilotWorkbenchUrl,
  isUsableProfilePhoto,
  resolveCurrentUser
} from './CurrentUserService';

describe('resolveCurrentUser', () => {
  const fallback = new MockZavaEmployeeDataService().getEmployeeExperience(
    new Date(2026, 7, 11, 12, 0, 0)
  ).user;

  test('returns the embedded mock persona when page context is unavailable', () => {
    expect(resolveCurrentUser(undefined, fallback)).toBe(fallback);
  });

  test('uses the real identity with the bundled sample photo when no host photo exists', () => {
    const user = resolveCurrentUser({
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'i:0#.f|membership|alex.wilber@zava.example'
        }
      }
    }, fallback);
    expect(user.displayName).toBe('Alex Wilber');
    expect(user.firstName).toBe('Alex');
    expect(user.photoUrl).toBe(embeddedImages.meganBowen);
  });

  test('preserves an already-provided host profile photo outside Workbench', () => {
    const hostPhoto = 'data:image/jpeg;base64,aG9zdC1waG90bw==';
    const user = resolveCurrentUser({
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'i:0#.f|membership|alex.wilber@zava.example',
          photoUrl: hostPhoto
        }
      }
    }, fallback, 'https://contoso.sharepoint.com/sites/hr/SitePages/Home.aspx');
    expect(user.photoUrl).toBe(hostPhoto);
  });

  test('rejects unusable host photo values and falls back to the bundled sample', () => {
    const unsafePhotoUrl = ['java', 'script:alert(1)'].join('');
    const user = resolveCurrentUser({
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'alex.wilber@zava.example',
          photoUrl: unsafePhotoUrl
        }
      }
    }, fallback);
    expect(user.photoUrl).toBe(embeddedImages.meganBowen);
  });

  test('detects tenant-agnostic Copilot Workbench URLs', () => {
    expect(isCopilotWorkbenchUrl(
      'https://contoso.sharepoint.com/_layouts/CopilotWorkbench.aspx?debug=true'
    )).toBe(true);
    expect(isCopilotWorkbenchUrl(
      'https://contoso.sharepoint.com/sites/hr/_layouts/15/CopilotWorkbench.aspx#preview'
    )).toBe(true);
    expect(isCopilotWorkbenchUrl('https://contoso.sharepoint.com/sites/hr/SitePages/Home.aspx')).toBe(false);
    expect(isCopilotWorkbenchUrl(undefined)).toBe(false);
  });

  test('preserves the current user photo in Workbench when the host provides one', () => {
    const hostPhoto = 'https://contoso.sharepoint.com/photo.jpg';
    const user = resolveCurrentUser({
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'i:0#.f|membership|alex.wilber@zava.example',
          photoUrl: hostPhoto
        }
      }
    }, fallback, 'https://contoso.sharepoint.com/_layouts/CopilotWorkbench.aspx?debug=true');
    expect(user.displayName).toBe('Alex Wilber');
    expect(user.photoUrl).toBe(hostPhoto);
  });

  test('uses the bundled sample photo in Workbench only when no host photo exists', () => {
    const user = resolveCurrentUser({
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'i:0#.f|membership|alex.wilber@zava.example'
        }
      }
    }, fallback, 'https://contoso.sharepoint.com/_layouts/CopilotWorkbench.aspx?debug=true');
    expect(user.photoUrl).toBe(embeddedImages.meganBowen);
  });

  test('uses a current-user photo exposed through legacy SharePoint page context', () => {
    const legacyPhoto = 'https://contoso.sharepoint.com/legacy-photo.jpg';
    const context = {
      pageContext: {
        user: {
          displayName: 'Alex Wilber',
          email: 'alex.wilber@zava.example',
          loginName: 'alex.wilber@zava.example'
        },
        legacyPageContext: { userPhotoUrl: legacyPhoto }
      }
    };
    expect(getHostProfilePhoto(context)).toBe(legacyPhoto);
    expect(resolveCurrentUser(context, fallback).photoUrl).toBe(legacyPhoto);
  });

  test('recognizes only supported image URL schemes', () => {
    const unsafePhotoUrl = ['java', 'script:alert(1)'].join('');
    expect(isUsableProfilePhoto('data:image/jpeg;base64,abc')).toBe(true);
    expect(isUsableProfilePhoto('blob:https://contoso.sharepoint.com/id')).toBe(true);
    expect(isUsableProfilePhoto('https://contoso.sharepoint.com/photo.jpg')).toBe(true);
    expect(isUsableProfilePhoto('http://contoso.example/photo.jpg')).toBe(false);
    expect(isUsableProfilePhoto(unsafePhotoUrl)).toBe(false);
    expect(isUsableProfilePhoto(undefined)).toBe(false);
  });
});