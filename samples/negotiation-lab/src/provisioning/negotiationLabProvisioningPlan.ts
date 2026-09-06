import type { M365ProvisioningPlan } from '@apvee/m365-actionable-provisioning';

import { NEGOTIATION_LISTS } from '../data/negotiationListIdentity';

const createSettings = {
  template: 100,
  hidden: false,
  onQuickLaunch: false,
  enableAttachments: false,
  enableFolderCreation: false,
  enableVersioning: true,
  majorVersionLimit: 10,
  noCrawl: true
} as const;

const modifySettings = {
  hidden: false,
  onQuickLaunch: false,
  enableAttachments: false,
  enableFolderCreation: false,
  enableVersioning: true,
  majorVersionLimit: 10
} as const;

export const negotiationLabProvisioningPlan: M365ProvisioningPlan = {
  schemaVersion: '1.0',
  title: 'Negotiation Lab lists',
  description: 'Creates a small scenario catalog and per-player practice state.',
  actions: [
    {
      verb: 'createSPList',
      listName: NEGOTIATION_LISTS.scenarios.name,
      title: NEGOTIATION_LISTS.scenarios.title,
      desc: 'The three packaged practice scenarios.',
      ...createSettings,
      readSecurity: 1,
      writeSecurity: 4,
      subactions: [
        {
          verb: 'addSPField',
          fieldType: 'Text',
          fieldName: 'ScenarioKey',
          displayName: 'Scenario key',
          required: true,
          maxLength: 80,
          indexed: true,
          enforceUniqueValues: true
        },
        {
          verb: 'addSPField',
          fieldType: 'MultilineText',
          fieldName: 'Briefing',
          displayName: 'Briefing',
          required: true,
          numberOfLines: 8,
          richText: false
        },
        {
          verb: 'addSPField',
          fieldType: 'MultilineText',
          fieldName: 'TermsJson',
          displayName: 'Terms JSON',
          required: true,
          numberOfLines: 20,
          richText: false
        },
        {
          verb: 'addSPField',
          fieldType: 'Boolean',
          fieldName: 'Enabled',
          displayName: 'Enabled',
          required: true,
          defaultValue: true
        },
        {
          verb: 'createSPListView',
          title: 'Scenarios',
          fields: ['LinkTitle', 'ScenarioKey', 'Briefing', 'Enabled', 'Modified'],
          viewQuery:
            '<OrderBy><FieldRef Name="Title" Ascending="TRUE"/></OrderBy>',
          rowLimit: 30,
          paged: true,
          defaultView: true
        }
      ]
    },
    {
      verb: 'modifySPList',
      listName: NEGOTIATION_LISTS.scenarios.name,
      title: NEGOTIATION_LISTS.scenarios.title,
      description: 'The three packaged practice scenarios.',
      ...modifySettings,
      subactions: [
        {
          verb: 'modifySPField',
          fieldType: 'Text',
          fieldName: 'ScenarioKey',
          displayName: 'Scenario key',
          required: true,
          maxLength: 80,
          indexed: true,
          enforceUniqueValues: true
        },
        {
          verb: 'modifySPField',
          fieldType: 'MultilineText',
          fieldName: 'Briefing',
          displayName: 'Briefing',
          required: true,
          numberOfLines: 8,
          richText: false
        },
        {
          verb: 'modifySPField',
          fieldType: 'MultilineText',
          fieldName: 'TermsJson',
          displayName: 'Terms JSON',
          required: true,
          numberOfLines: 20,
          richText: false
        },
        {
          verb: 'modifySPField',
          fieldType: 'Boolean',
          fieldName: 'Enabled',
          displayName: 'Enabled',
          required: true,
          defaultValue: true
        },
        {
          verb: 'modifySPListView',
          title: 'Scenarios',
          fields: ['LinkTitle', 'ScenarioKey', 'Briefing', 'Enabled', 'Modified'],
          viewQuery:
            '<OrderBy><FieldRef Name="Title" Ascending="TRUE"/></OrderBy>',
          rowLimit: 30,
          paged: true,
          defaultView: true
        }
      ]
    },
    {
      verb: 'createSPList',
      listName: NEGOTIATION_LISTS.sessions.name,
      title: NEGOTIATION_LISTS.sessions.title,
      desc: 'One compact JSON state item per player practice.',
      ...createSettings,
      readSecurity: 2,
      writeSecurity: 2,
      subactions: [
        {
          verb: 'addSPField',
          fieldType: 'Text',
          fieldName: 'ScenarioKey',
          displayName: 'Scenario key',
          required: true,
          maxLength: 80,
          indexed: true
        },
        {
          verb: 'addSPField',
          fieldType: 'Choice',
          fieldName: 'Status',
          displayName: 'Status',
          required: true,
          choices: ['Active', 'Completed'],
          defaultChoice: 'Active',
          indexed: true
        },
        {
          verb: 'addSPField',
          fieldType: 'MultilineText',
          fieldName: 'StateJson',
          displayName: 'State JSON',
          required: true,
          numberOfLines: 20,
          richText: false
        },
        {
          verb: 'createSPListView',
          title: 'My practices',
          fields: ['LinkTitle', 'ScenarioKey', 'Status', 'Modified'],
          viewQuery:
            '<OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy>',
          rowLimit: 30,
          paged: true,
          defaultView: true
        }
      ]
    },
    {
      verb: 'modifySPList',
      listName: NEGOTIATION_LISTS.sessions.name,
      title: NEGOTIATION_LISTS.sessions.title,
      description: 'One compact JSON state item per player practice.',
      ...modifySettings,
      subactions: [
        {
          verb: 'modifySPField',
          fieldType: 'Text',
          fieldName: 'ScenarioKey',
          displayName: 'Scenario key',
          required: true,
          maxLength: 80,
          indexed: true
        },
        {
          verb: 'modifySPField',
          fieldType: 'Choice',
          fieldName: 'Status',
          displayName: 'Status',
          required: true,
          choices: ['Active', 'Completed'],
          defaultChoice: 'Active',
          indexed: true
        },
        {
          verb: 'modifySPField',
          fieldType: 'MultilineText',
          fieldName: 'StateJson',
          displayName: 'State JSON',
          required: true,
          numberOfLines: 20,
          richText: false
        },
        {
          verb: 'modifySPListView',
          title: 'My practices',
          fields: ['LinkTitle', 'ScenarioKey', 'Status', 'Modified'],
          viewQuery:
            '<OrderBy><FieldRef Name="Modified" Ascending="FALSE"/></OrderBy>',
          rowLimit: 30,
          paged: true,
          defaultView: true
        }
      ]
    }
  ]
};
