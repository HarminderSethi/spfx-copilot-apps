export type ZavaFamilyId =
  | 'home'
  | 'time'
  | 'money'
  | 'benefits'
  | 'rewards'
  | 'policy'
  | 'support'
  | 'learning'
  | 'team'
  | 'people';

export type ZavaFamilyThemeVariant = ZavaFamilyId;

export interface IZavaFamilyMetadata {
  id: ZavaFamilyId;
  order: number;
  railLabel: string;
  label: string;
  iconKey: string;
  themeVariant: ZavaFamilyThemeVariant;
  placeholderSummary: string;
}

export const ZAVA_FAMILIES: ReadonlyArray<IZavaFamilyMetadata> = [
  { id: 'home', order: 1, railLabel: 'Home', label: 'My HR Dashboard', iconKey: 'home', themeVariant: 'home', placeholderSummary: 'Your personalized overview across work and HR.' },
  { id: 'time', order: 2, railLabel: 'Time', label: 'PTO & Leave', iconKey: 'calendar', themeVariant: 'time', placeholderSummary: 'Balances, requests, status, usage, and team coverage.' },
  { id: 'money', order: 3, railLabel: 'Money', label: 'Payroll Explainer', iconKey: 'wallet', themeVariant: 'money', placeholderSummary: 'Pay, deductions, documents, and clear change explanations.' },
  { id: 'benefits', order: 4, railLabel: 'Benefits', label: 'Benefits & Life Events', iconKey: 'heart', themeVariant: 'benefits', placeholderSummary: 'Coverage, comparisons, dependents, and life-event changes.' },
  { id: 'rewards', order: 5, railLabel: 'Rewards', label: 'Total Rewards', iconKey: 'trophy', themeVariant: 'rewards', placeholderSummary: 'Your complete pay, bonus, equity, pension, and benefits value.' },
  { id: 'policy', order: 6, railLabel: 'Policy', label: 'Policy Q&A', iconKey: 'document', themeVariant: 'policy', placeholderSummary: 'Policy answers with applicability, changes, and source receipts.' },
  { id: 'support', order: 7, railLabel: 'Support', label: 'HR Case Desk', iconKey: 'support', themeVariant: 'support', placeholderSummary: 'Knowledge-first help and private case follow-up.' },
  { id: 'learning', order: 8, railLabel: 'Learning', label: 'Learning & Compliance', iconKey: 'learning', themeVariant: 'learning', placeholderSummary: 'Required learning, progress, recommendations, and role growth.' },
  { id: 'team', order: 9, railLabel: 'Team', label: 'Manager Team Hub', iconKey: 'team', themeVariant: 'team', placeholderSummary: 'Approvals, team signals, absence, and manager actions.' },
  { id: 'people', order: 10, railLabel: 'People', label: 'Org & People Graph', iconKey: 'people', themeVariant: 'people', placeholderSummary: 'Relationships, organization context, and expertise discovery.' }
];

export const isZavaFamilyId = (value: string): value is ZavaFamilyId =>
  ZAVA_FAMILIES.some((family) => family.id === value);

export const getZavaFamily = (familyId: ZavaFamilyId): IZavaFamilyMetadata =>
  ZAVA_FAMILIES.find((family) => family.id === familyId) || ZAVA_FAMILIES[0];