import { getFamilyExperience, getFamilyExperiences } from './familyExperienceCatalog';
import { getFamilyDashboardExperiences } from './familyDashboardCatalog';

describe('family experience catalog', () => {
  const activeFamilies = ['time', 'money', 'benefits', 'support', 'learning', 'rewards', 'team', 'people'] as const;

  test('contains exactly 13 catalog-driven intents alongside the two bespoke Policy intents', () => {
    const experiences = activeFamilies.reduce((all, family) => all.concat(getFamilyExperiences(family)), [] as ReturnType<typeof getFamilyExperiences>);
    expect(experiences).toHaveLength(13);
    expect(new Set(experiences.map((item) => item.key)).size).toBe(13);
    expect(new Set(experiences.map((item) => item.route)).size).toBe(13);
  });

  test.each(activeFamilies)('keeps five %s full-screen surfaces without adding inline intents', (family) => {
    const dashboardExperiences = getFamilyDashboardExperiences(family);
    expect(dashboardExperiences).toHaveLength(5);
    expect(new Set(dashboardExperiences.map((item) => item.route)).size).toBe(5);
    expect(getFamilyExperiences(family).length).toBeLessThanOrEqual(2);
  });

  test.each([
    ['leaveBalance', 'time/balance'],
    ['explainPayChange', 'money/explain-change'],
    ['compareBenefitPlans', 'benefits/compare'],
    ['createHrCase', 'support/create'],
    ['requiredLearning', 'learning/required'],
    ['totalRewardsSummary', 'rewards/summary'],
    ['teamAbsenceCalendar', 'team/absence'],
    ['findExpert', 'people/expert']
  ])('maps %s to %s', (key, route) => {
    expect(getFamilyExperience(key).route).toBe(route);
  });
});