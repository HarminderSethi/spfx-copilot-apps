import { EMBEDDED_FACES } from '../mockData/embeddedFaces';
import { MockProjectPortfolioDataService } from './MockProjectPortfolioDataService';

describe('MockProjectPortfolioDataService', () => {
  const service = new MockProjectPortfolioDataService();
  const now = new Date('2026-08-18T09:00:00Z');

  test('returns the coherent leadership portfolio', () => {
    const experience = service.getExperience(now);
    expect(experience.projects).toHaveLength(8);
    expect(experience.people).toHaveLength(11);
    expect(experience.objectives).toHaveLength(5);
    expect(experience.projects.find((project) => project.id === 'PRJ-2601')).toMatchObject({
      title: 'Customer Service Copilot',
      health: 'amber',
      aiSpend: 178200,
      scheduleVarianceDays: 8
    });
  });

  test('keeps all cross-source references valid', () => {
    const experience = service.getExperience(now);
    const people = new Set(experience.people.map((person) => person.id));
    const projects = new Set(experience.projects.map((project) => project.id));
    const objectives = new Set(experience.objectives.map((objective) => objective.id));

    experience.projects.forEach((project) => {
      expect(people.has(project.managerId)).toBe(true);
      expect(people.has(project.sponsorId)).toBe(true);
      project.objectiveIds.forEach((objectiveId) => expect(objectives.has(objectiveId)).toBe(true));
    });
    experience.risks.forEach((risk) => {
      expect(projects.has(risk.projectId)).toBe(true);
      expect(people.has(risk.ownerId)).toBe(true);
    });
    experience.workItems.forEach((workItem) => {
      expect(projects.has(workItem.projectId)).toBe(true);
      expect(people.has(workItem.ownerId)).toBe(true);
    });
    experience.milestones.forEach((milestone) => {
      expect(projects.has(milestone.projectId)).toBe(true);
      expect(people.has(milestone.ownerId)).toBe(true);
    });
    experience.allocations.forEach((allocation) => {
      expect(projects.has(allocation.projectId)).toBe(true);
      expect(people.has(allocation.personId)).toBe(true);
    });
    experience.approvals.forEach((approval) => {
      expect(projects.has(approval.projectId)).toBe(true);
      expect(people.has(approval.requesterId)).toBe(true);
      expect(people.has(approval.decisionMakerId)).toBe(true);
    });
  });

  test('resolves relative dates from a stable supplied clock', () => {
    const experience = service.getExperience(now);
    expect(experience.projects[0].nextGateDate.toISOString()).toBe('2026-09-30T09:00:00.000Z');
    expect(experience.approvals[0].dueDate.toISOString()).toBe('2026-08-19T09:00:00.000Z');
    expect(experience.aiUsage[0].usageDate.toISOString()).toBe('2026-08-17T09:00:00.000Z');
  });

  test('applies scenarios without mutating the approved baseline', () => {
    const baseline = service.getExperience(now, 'leadership-demo');
    const pressure = service.getExperience(now, 'capacity-pressure');
    expect(pressure.allocations[2].allocationPercent).toBeGreaterThan(baseline.allocations[2].allocationPercent);
    expect(service.getExperience(now, 'leadership-demo').allocations[2].allocationPercent).toBe(48);
  });

  test('provides a bundled portrait for every person', () => {
    service.getExperience(now).people.forEach((person) => {
      expect(EMBEDDED_FACES[person.imageKey]).toMatch(/^data:image\/jpeg;base64,/);
    });
  });
});