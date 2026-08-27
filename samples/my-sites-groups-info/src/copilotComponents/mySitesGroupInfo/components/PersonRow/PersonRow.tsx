import * as React from 'react';
import { Body1, Button, Caption1 } from '@fluentui/react-components';
import type { IGroupPerson } from '../../services/SitesGroupInfoService';

export interface IPersonRowProps {
  person: IGroupPerson;
  canRemove?: boolean;
  onRemove?: () => void;
  personClassName?: string;
  personTextClassName?: string;
}

export function PersonRow(props: Readonly<IPersonRowProps>): React.ReactElement {
  return (
    <div className={props.personClassName}>
      <div className={props.personTextClassName}>
        <Body1>{props.person.displayName}</Body1>
        {props.person.email && <Caption1>{props.person.email}</Caption1>}
      </div>
      {props.canRemove && (
        <Button appearance="subtle" onClick={props.onRemove}>
          Remove
        </Button>
      )}
    </div>
  );
}
