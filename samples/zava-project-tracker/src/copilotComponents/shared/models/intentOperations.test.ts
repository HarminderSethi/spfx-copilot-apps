import { PROJECT_INTENT_CATALOG } from '../mockData/intentCatalog';
import { getInlineOperation } from './intentOperations';

describe('inline operation catalog', () => {
  test('classifies thirty operational intents plus one education intent', () => {
    const counts = PROJECT_INTENT_CATALOG.reduce<Record<string, number>>((result, definition) => {
      const operation = getInlineOperation(definition.key);
      result[operation] = (result[operation] || 0) + 1;
      return result;
    }, {});

    expect(counts).toEqual({ information: 19, review: 5, submit: 6, education: 1 });
  });

  test.each([
    ['GetProjectAiSpend', 'information'],
    ['GetApprovalInbox', 'review'],
    ['ReviewResourceAssignment', 'review'],
    ['SubmitTimesheet', 'submit'],
    ['RequestAiBudget', 'submit'],
    ['ExploreAgentCapabilities', 'education']
  ])('classifies %s as %s', (intentKey, operation) => {
    expect(getInlineOperation(intentKey)).toBe(operation);
  });
});