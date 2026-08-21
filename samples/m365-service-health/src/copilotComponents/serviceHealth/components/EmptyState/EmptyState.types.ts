import type * as React from 'react';

export interface IEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  detail?: string;
  children?: React.ReactNode;
}
