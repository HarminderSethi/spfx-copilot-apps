import { negotiationLabProvisioningPlan } from './negotiationLabProvisioningPlan';

describe('lean APVEE provisioning plan', () => {
  const creates = negotiationLabProvisioningPlan.actions.filter(
    (action) => action.verb === 'createSPList'
  );

  it('creates the scenario and session lists with the expected names', () => {
    expect(creates.map(({ listName }) => listName)).toEqual([
      'NegotiationScenarios',
      'NegotiationSessions'
    ]);
    expect(JSON.stringify(negotiationLabProvisioningPlan)).not.toContain(
      'NegotiationLabSessions'
    );
  });

  it('uses only four scenario fields and three session fields', () => {
    const fieldNames = creates.map((list) =>
      (list.subactions ?? [])
        .filter((action) => action.verb === 'addSPField')
        .map((action) => action.fieldName)
    );
    expect(fieldNames).toEqual([
      ['ScenarioKey', 'Briefing', 'TermsJson', 'Enabled'],
      ['ScenarioKey', 'Status', 'StateJson']
    ]);
  });

  it('keeps scenarios public and sessions private to their authors', () => {
    expect(creates[0]).toMatchObject({ readSecurity: 1, writeSecurity: 4 });
    expect(creates[1]).toMatchObject({ readSecurity: 2, writeSecurity: 2 });
  });

  it('pairs create actions with modify actions for safe repeat runs', () => {
    const modifies = negotiationLabProvisioningPlan.actions.filter(
      (action) => action.verb === 'modifySPList'
    );
    expect(modifies.map(({ listName }) => listName)).toEqual([
      'NegotiationScenarios',
      'NegotiationSessions'
    ]);
    expect(
      modifies.every((list) =>
        (list.subactions ?? []).some(
          (action) => action.verb === 'modifySPListView'
        )
      )
    ).toBe(true);
  });
});
