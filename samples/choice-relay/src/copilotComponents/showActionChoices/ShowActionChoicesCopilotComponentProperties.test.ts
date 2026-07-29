import propertiesSchema from './ShowActionChoicesCopilotComponentProperties';

describe('ChoiceRelayShowChoices parameter schema', () => {
  it('stays inside the conservative plugin parameter subset', () => {
    const schemaText = JSON.stringify(propertiesSchema);

    expect(schemaText).toContain('"question"');
    expect(schemaText).toContain('"options"');
    expect(schemaText).toContain('Copilot-generated');
    expect(schemaText).toContain('one reversible action');
    expect(schemaText).not.toMatch(
      /"(?:minLength|maxLength|minItems|maxItems|minimum|maximum|pattern)"/
    );
  });
});
