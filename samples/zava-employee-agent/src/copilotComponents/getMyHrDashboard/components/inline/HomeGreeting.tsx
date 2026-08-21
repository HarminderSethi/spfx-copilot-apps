import * as React from 'react';

import { Sparkle24Filled } from '@fluentui/react-icons';

import type { IZavaUser } from '../../../shared/models/zavaEmployee';
import { getGreeting } from '../../../shared/utils/greeting';
import InlineHeader from '../../../shared/components/InlineHeader';

export interface IHomeGreetingProps {
  user: IZavaUser;
  now: Date;
  onRequestFullscreen?: () => void;
}

const HomeGreeting: React.FunctionComponent<IHomeGreetingProps> = (props) => {
  const greeting = getGreeting(props.now);
  return (
    <InlineHeader
      user={props.user}
      icon={<Sparkle24Filled />}
      title={`${greeting.text}, ${props.user.firstName}`}
      subtitle={greeting.subtext}
      expandLabel="Open full HR dashboard"
      onRequestFullscreen={props.onRequestFullscreen}
    />
  );
};

export default HomeGreeting;