import { MockZavaEmployeeDataService } from '../services/MockZavaEmployeeDataService';
import { isZavaManager } from './roles';

describe('role access', () => {
  const user = new MockZavaEmployeeDataService().getEmployeeExperience().user;

  test('recognizes the sample lead as a manager', () => {
    expect(isZavaManager(user)).toBe(true);
  });

  test('does not grant manager access from a general employee title', () => {
    expect(isZavaManager({ ...user, jobTitle: 'Product Designer' })).toBe(false);
    expect(isZavaManager({ ...user, jobTitle: undefined })).toBe(false);
  });
});