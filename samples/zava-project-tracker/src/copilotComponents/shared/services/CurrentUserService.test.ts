import { resolveCurrentUser } from './CurrentUserService';

describe('resolveCurrentUser', () => {
  test('uses an already host-provided online photo', () => {
    expect(resolveCurrentUser({ pageContext: { user: {
      displayName: 'Vesa Juvonen',
      photoUrl: 'https://contoso.example/photo.jpg'
    } } })).toEqual({
      displayName: 'Vesa Juvonen',
      photoUrl: 'https://contoso.example/photo.jpg'
    });
  });

  test('does not construct or request a profile photo', () => {
    expect(resolveCurrentUser({ pageContext: { user: {
      displayName: 'Vesa Juvonen',
      email: 'vesa@contoso.example'
    } } })).toEqual({ displayName: 'Vesa Juvonen' });
  });

  test('accepts a host-provided data URI and ignores unsafe URLs', () => {
    expect(resolveCurrentUser({ pageContext: {
      user: { displayName: 'Megan Bowen', photoUrl: '/_layouts/userphoto.aspx' },
      legacyPageContext: { userPhotoUrl: 'data:image/jpeg;base64,AA==' }
    } })).toEqual({
      displayName: 'Megan Bowen',
      photoUrl: 'data:image/jpeg;base64,AA=='
    });
  });
});