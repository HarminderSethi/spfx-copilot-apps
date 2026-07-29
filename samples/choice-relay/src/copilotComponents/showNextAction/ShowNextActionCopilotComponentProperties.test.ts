import propertiesSchema from './ShowNextActionCopilotComponentProperties';

describe('ChoiceRelayShowNextAction parameter schema', () => {
  it('describes a concise grounded result without unsupported constraints', () => {
    const schemaText = JSON.stringify(propertiesSchema);

    expect(schemaText).toContain('"selectedOption"');
    expect(schemaText).toContain('"nextAction"');
    expect(schemaText).toContain('"explanation"');
    expect(schemaText).toContain('no more than 25 words');
    expect(schemaText).toContain('invented details');
    expect(schemaText).not.toMatch(
      /"(?:minLength|maxLength|minItems|maxItems|minimum|maximum|pattern)"/
    );
  });
});
