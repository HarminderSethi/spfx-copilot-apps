import * as React from 'react';
import { Button, Title3 } from '@fluentui/react-components';
import { ArrowClockwise24Regular, ArrowMinimize20Regular, ArrowExpand20Regular } from '@fluentui/react-icons';

export interface IResourceHeaderProps {
  title: string;
  isLoading: boolean;
  isExpanded?: boolean;
  onRefresh: () => void;
  onToggleExpand?: () => void;
  headerClassName?: string;
  introClassName?: string;
}

export function ResourceHeader(props: Readonly<IResourceHeaderProps>): React.ReactElement {
  return (
    <div className={props.headerClassName}>
      <div className={props.introClassName}>
        <Title3>{props.title}</Title3>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button
          appearance="subtle"
          icon={<ArrowClockwise24Regular />}
          onClick={props.onRefresh}
          disabled={props.isLoading}
        >
          Refresh
        </Button>
        {props.onToggleExpand && (
          <Button
            appearance="subtle"
            icon={props.isExpanded ? <ArrowMinimize20Regular /> : <ArrowExpand20Regular />}
            onClick={props.onToggleExpand}
            aria-label={props.isExpanded ? 'Collapse view' : 'Expand view'}
          >
            {props.isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        )}
      </div>
    </div>
  );
}
