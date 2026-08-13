import { isZavaFamilyId } from '../../shared/models/families';
import { MockZavaEmployeeDataService } from '../../shared/services/MockZavaEmployeeDataService';
import { buildHrActionPlan } from './buildHrActionPlan';

describe('buildHrActionPlan', () => {
  const now = new Date(2026, 7, 11, 12, 0, 0);
  const data = new MockZavaEmployeeDataService().getEmployeeExperience(now);

  test('ranks blocking and near-term actions deterministically', () => {
    const plan = buildHrActionPlan(data.signals, data.user, now, 'standard', false);
    expect(plan.items).toHaveLength(5);
    expect(plan.items[0]).toMatchObject({
      family: 'learning',
      bucket: 'blocking',
      title: 'Finish privacy foundations'
    });
    expect(plan.items.map((item) => item.id)).toEqual(
      buildHrActionPlan(data.signals, data.user, now, 'standard', false)
        .items.map((item) => item.id)
    );
  });

  test('omits sensitive pay, case, and rewards items by default', () => {
    const standard = buildHrActionPlan(data.signals, data.user, now, 'standard', false);
    const sensitive = buildHrActionPlan(data.signals, data.user, now, 'sensitive', false);
    expect(standard.items.some((item) => item.family === 'money' || item.family === 'support'))
      .toBe(false);
    expect(sensitive.items.some((item) => item.family === 'support')).toBe(true);
  });

  test('personalizes the headline and retains valid typed destinations', () => {
    const plan = buildHrActionPlan(data.signals, data.user, now, 'standard', false);
    expect(plan.headline).toContain('Megan');
    expect(plan.items.every((item) =>
      isZavaFamilyId(item.destination.family) && item.destination.route.length > 0
    )).toBe(true);
  });

  test('returns a positive empty plan', () => {
    const plan = buildHrActionPlan([], data.user, now, 'standard', false);
    expect(plan.items).toEqual([]);
    expect(plan.headline).toContain('all caught up');
  });
});