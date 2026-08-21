import type { IGraphUser } from '../models/graph';
import type { IZavaPerson } from '../models/zavaEmployee';

export interface IMockPersonRecord {
  profile: IGraphUser;
  relationship: IZavaPerson['relationship'];
  skills: string[];
  photoKey: string;
}

export const mockPeople: ReadonlyArray<IMockPersonRecord> = [
  {
    profile: {
      id: 'megan-bowen',
      displayName: 'Megan Bowen',
      givenName: 'Megan',
      mail: 'megan.bowen@zava.example',
      jobTitle: 'Product Design Lead',
      department: 'Employee Experience',
      officeLocation: 'Helsinki'
    },
    relationship: 'self',
    skills: ['Employee experience', 'Design systems', 'Accessibility'],
    photoKey: 'meganBowen'
  },
  {
    profile: {
      id: 'diego-siciliani',
      displayName: 'Diego Siciliani',
      givenName: 'Diego',
      mail: 'diego.siciliani@zava.example',
      jobTitle: 'Director, Employee Products',
      department: 'Digital Workplace',
      officeLocation: 'Helsinki'
    },
    relationship: 'manager',
    skills: ['Leadership', 'Employee products', 'Strategy'],
    photoKey: 'diegoSiciliani'
  },
  {
    profile: {
      id: 'patti-fernandez',
      displayName: 'Patti Fernandez',
      givenName: 'Patti',
      mail: 'patti.fernandez@zava.example',
      jobTitle: 'HR Business Partner',
      department: 'People Operations',
      officeLocation: 'Helsinki'
    },
    relationship: 'hrPartner',
    skills: ['Employee relations', 'Benefits', 'Career development'],
    photoKey: 'pattiFernandez'
  },
  {
    profile: {
      id: 'lee-gu',
      displayName: 'Lee Gu',
      givenName: 'Lee',
      mail: 'lee.gu@zava.example',
      jobTitle: 'Principal Product Manager',
      department: 'Employee Experience',
      officeLocation: 'Stockholm'
    },
    relationship: 'collaborator',
    skills: ['Product management', 'Copilot Apps', 'Research'],
    photoKey: 'leeGu'
  },
  {
    profile: {
      id: 'johanna-lorenz',
      displayName: 'Johanna Lorenz',
      givenName: 'Johanna',
      mail: 'johanna.lorenz@zava.example',
      jobTitle: 'Accessibility Program Lead',
      department: 'Responsible AI',
      officeLocation: 'Berlin'
    },
    relationship: 'expert',
    skills: ['Accessibility', 'Inclusive design', 'Keynote reviews'],
    photoKey: 'johannaLorenz'
  },
  {
    profile: {
      id: 'nestor-wilke',
      displayName: 'Nestor Wilke',
      givenName: 'Nestor',
      mail: 'nestor.wilke@zava.example',
      jobTitle: 'Benefits Operations Lead',
      department: 'People Operations',
      officeLocation: 'Munich'
    },
    relationship: 'expert',
    skills: ['Benefits', 'Open enrollment', 'Life events'],
    photoKey: 'nestorWilke'
  },
  {
    profile: {
      id: 'pradeep-gupta',
      displayName: 'Pradeep Gupta',
      givenName: 'Pradeep',
      mail: 'pradeep.gupta@zava.example',
      jobTitle: 'Global Mobility Specialist',
      department: 'People Operations',
      officeLocation: 'London'
    },
    relationship: 'expert',
    skills: ['Mobility', 'Leave policy', 'Cross-border work'],
    photoKey: 'pradeepGupta'
  }
];