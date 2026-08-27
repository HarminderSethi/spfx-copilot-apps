import propertiesSchema from './GetMyHrDashboardCopilotComponentProperties';

describe('GetMyHrDashboard properties schema', () => {
  test('describes every supported prompt property', () => {
    const schema = propertiesSchema as {
      properties?: { [key: string]: { description?: string } };
    };
    const expected = [
      'period',
      'focusArea',
      'includeSensitive',
      'locale',
      'privacyLevel'
    ];
    expect(Object.keys(schema.properties || {})).toEqual(expected);
    expected.forEach((key) => {
      expect(schema.properties?.[key].description).toBeTruthy();
    });
    expect(schema.properties?.view).toBeUndefined();
  });
});