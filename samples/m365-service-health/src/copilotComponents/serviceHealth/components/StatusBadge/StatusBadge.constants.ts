import type * as React from 'react';
import {
  CheckmarkCircle16Filled,
  ErrorCircle16Filled,
  QuestionCircle16Filled,
  Warning16Filled
} from '@fluentui/react-icons';

import type { ServiceHealthSeverity } from '../../models';

type BadgeColor = 'success' | 'warning' | 'danger' | 'informative';

export const SEVERITY_APPEARANCE: Readonly<Record<ServiceHealthSeverity, { color: BadgeColor; Icon: React.FC }>> = {
  healthy: { color: 'success', Icon: CheckmarkCircle16Filled },
  advisory: { color: 'warning', Icon: Warning16Filled },
  incident: { color: 'danger', Icon: ErrorCircle16Filled },
  unknown: { color: 'informative', Icon: QuestionCircle16Filled }
};
