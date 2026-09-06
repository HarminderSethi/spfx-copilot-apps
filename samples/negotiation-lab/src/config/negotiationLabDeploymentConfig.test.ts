import { validateNegotiationLabDeploymentConfig } from './negotiationLabDeploymentConfig';

describe('Negotiation Lab deployment configuration', () => {
  it('accepts a dedicated server-relative site', () => {
    expect(
      validateNegotiationLabDeploymentConfig({ targetSiteUrl: '/sites/negotiation-lab/' })
    ).toEqual({ targetSiteUrl: '/sites/negotiation-lab' });
  });

  it('accepts an HTTPS site URL', () => {
    expect(
      validateNegotiationLabDeploymentConfig({
        targetSiteUrl: 'https://contoso.sharepoint.com/sites/negotiation-lab'
      })
    ).toEqual({
      targetSiteUrl: 'https://contoso.sharepoint.com/sites/negotiation-lab'
    });
  });

  it.each([
    '',
    '/',
    '//evil.example/sites/negotiation-lab',
    'http://contoso.sharepoint.com/sites/negotiation-lab',
    'https://contoso.sharepoint.com/sites/negotiation-lab?x=1'
  ])('rejects unsafe target %s', (targetSiteUrl) => {
    expect(() =>
      validateNegotiationLabDeploymentConfig({ targetSiteUrl })
    ).toThrow();
  });
});
