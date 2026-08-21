import * as React from 'react';

import { Sparkle24Filled } from '@fluentui/react-icons';

import type { IHrActionPlan } from '../../models/hrActionPlan';
import type { IZavaPerson } from '../../../shared/models/zavaEmployee';
import SharedPriorityBanner from '../../../shared/components/PriorityBanner';

export interface IPriorityBannerProps {
  plan: IHrActionPlan;
  people: IZavaPerson[];
  triggerRef: React.RefObject<HTMLButtonElement>;
  onOpen: () => void;
}

const PriorityBanner: React.FunctionComponent<IPriorityBannerProps> = (props) => {
  const priorityCount = props.plan.items.filter(
    (item) => item.bucket === 'blocking' || item.bucket === 'overdue' || item.bucket === 'thisWeek'
  ).length;
  const summary = priorityCount === 0
    ? 'Your HR signals are clear. This is a good moment to look ahead.'
    : `${priorityCount} priorit${priorityCount === 1 ? 'y' : 'ies'} need attention. Let me shape the best order for you.`;
  return (
    <SharedPriorityBanner
      icon={<Sparkle24Filled />}
      title="Start your week with clarity"
      subtitle={summary}
      people={props.people}
      actionLabel="Build my HR action plan"
      triggerRef={props.triggerRef}
      onAction={props.onOpen}
    />
  );
};

export default PriorityBanner;