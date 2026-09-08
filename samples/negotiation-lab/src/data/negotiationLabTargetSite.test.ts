import { resolveNegotiationLabTargetSiteUrlFromAmbient } from './negotiationLabTargetSite';

describe('Negotiation Lab target site', () => {
  const ambient = 'https://contoso.sharepoint.com/sites/app-host';

  it('resolves a same-tenant server-relative site', () => {
    expect(
      resolveNegotiationLabTargetSiteUrlFromAmbient(ambient, '/sites/negotiation-lab')
    ).toBe('https://contoso.sharepoint.com/sites/negotiation-lab');
  });

  it('rejects a cross-tenant target', () => {
    expect(() =>
      resolveNegotiationLabTargetSiteUrlFromAmbient(
        ambient,
        'https://fabrikam.sharepoint.com/sites/negotiation-lab'
      )
    ).toThrow(/current SharePoint tenant/i);
  });

  it('rejects query strings and fragments', () => {
    expect(() =>
      resolveNegotiationLabTargetSiteUrlFromAmbient(
        ambient,
        '/sites/negotiation-lab?debug=true'
      )
    ).toThrow();
  });
});
