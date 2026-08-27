import * as React from 'react';

import {
  CalendarLtr20Regular,
  DocumentText20Regular,
  Heart20Regular,
  Home20Filled,
  LearningApp20Regular,
  Organization20Regular,
  PeopleTeam20Regular,
  PersonSupport20Regular,
  Trophy20Regular,
  Wallet20Regular
} from '@fluentui/react-icons';

import type { ZavaFamilyId } from '../models/families';

export interface IFamilyIconProps {
  family: ZavaFamilyId;
}

const FamilyIcon: React.FunctionComponent<IFamilyIconProps> = ({ family }) => {
  switch (family) {
    case 'time': return <CalendarLtr20Regular />;
    case 'money': return <Wallet20Regular />;
    case 'benefits': return <Heart20Regular />;
    case 'rewards': return <Trophy20Regular />;
    case 'policy': return <DocumentText20Regular />;
    case 'support': return <PersonSupport20Regular />;
    case 'learning': return <LearningApp20Regular />;
    case 'team': return <PeopleTeam20Regular />;
    case 'people': return <Organization20Regular />;
    default: return <Home20Filled />;
  }
};

export default FamilyIcon;