import type { IReleasePlan } from '../models/IReleaseReadiness';

export const getMockReleaseReadinessData = (): IReleasePlan[] => {
  const now = new Date();
  const plusDays = (days: number): string => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  return [
    {
      id: 'release-2-8',
      name: 'Release v2.8',
      product: 'Commerce API',
      environment: 'Production',
      targetDate: plusDays(3),
      updatedAt: plusDays(0),
      checks: [
        {
          id: 'r28-code-freeze',
          title: 'Code freeze approved',
          area: 'Code',
          owner: 'Nora',
          dueDate: plusDays(0),
          status: 'done',
          userStoryIds: ['US-2411', 'US-2414'],
          updatedAt: plusDays(0)
        },
        {
          id: 'r28-qa-regression',
          title: 'Regression suite pass',
          area: 'QA',
          owner: 'Mantas',
          dueDate: plusDays(1),
          status: 'pending',
          userStoryIds: ['US-2411', 'US-2430'],
          note: '2 flaky checkout tests under investigation.',
          updatedAt: plusDays(0)
        },
        {
          id: 'r28-security-signoff',
          title: 'Security sign-off',
          area: 'Security',
          owner: 'Ieva',
          dueDate: plusDays(1),
          status: 'blocked',
          userStoryIds: ['US-2438'],
          blockerType: 'Security',
          note: 'Waiting for SAST rerun after dependency update.',
          updatedAt: plusDays(0)
        },
        {
          id: 'r28-runbook',
          title: 'Rollback runbook updated',
          area: 'Operations',
          owner: 'Domas',
          dueDate: plusDays(2),
          status: 'done',
          userStoryIds: ['US-2360'],
          updatedAt: plusDays(0)
        },
        {
          id: 'r28-release-notes',
          title: 'Release notes published',
          area: 'Documentation',
          owner: 'Aiste',
          dueDate: plusDays(2),
          status: 'pending',
          userStoryIds: ['US-2411', 'US-2438'],
          updatedAt: plusDays(0)
        }
      ]
    },
    {
      id: 'release-3-0',
      name: 'Release v3.0',
      product: 'Web Portal',
      environment: 'Staging',
      targetDate: plusDays(12),
      updatedAt: plusDays(0),
      checks: [
        {
          id: 'r30-feature-complete',
          title: 'Feature completion checklist',
          area: 'Code',
          owner: 'Nora',
          dueDate: plusDays(6),
          status: 'pending',
          userStoryIds: ['US-2501', 'US-2507', 'US-2510'],
          updatedAt: plusDays(0)
        },
        {
          id: 'r30-load-test',
          title: 'Load test baseline',
          area: 'QA',
          owner: 'Mantas',
          dueDate: plusDays(7),
          status: 'blocked',
          blockerType: 'Environment',
          userStoryIds: ['US-2501'],
          note: 'Staging load-test environment is unavailable.',
          updatedAt: plusDays(0)
        },
        {
          id: 'r30-pentest-window',
          title: 'Pen-test window confirmation',
          area: 'Security',
          owner: 'Ieva',
          dueDate: plusDays(8),
          status: 'pending',
          userStoryIds: ['US-2510'],
          updatedAt: plusDays(0)
        },
        {
          id: 'r30-runbook-dryrun',
          title: 'Deployment dry run',
          area: 'Operations',
          owner: 'Valeras',
          dueDate: plusDays(10),
          status: 'blocked',
          userStoryIds: ['US-2507'],
          blockerType: 'Dependency',
          note: 'Waiting for platform team to publish migration package.',
          updatedAt: plusDays(0)
        },
        {
          id: 'r30-product-approval',
          title: 'Product owner release sign-off',
          area: 'Documentation',
          owner: 'Aiste',
          dueDate: plusDays(9),
          status: 'blocked',
          blockerType: 'Approval',
          userStoryIds: ['US-2501', 'US-2507'],
          note: 'Acceptance notes still pending from business owner.',
          updatedAt: plusDays(0)
        }
      ]
    }
  ];
};
