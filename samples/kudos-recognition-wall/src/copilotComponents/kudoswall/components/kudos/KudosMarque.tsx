import * as React from 'react';
import { tokens } from '@fluentui/react-components';

export interface IKudosMarqueProps {
  /** Overall diameter in px. Insets scale from the 22px reference. */
  size?: number;
}

/**
 * The Wave Power marque — concentric brand rings around a solid dot. Shared by
 * the inline card header and the recognition wall title so both read as one
 * brand mark. Colour comes from the Fluent brand slot, so it flips with theme.
 */
export const KudosMarque: React.FC<IKudosMarqueProps> = ({ size = 22 }) => {
  const ring2 = Math.round((size * 4) / 22);
  const dot = Math.round((size * 8) / 22);
  return (
    <span
      aria-hidden="true"
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-block' }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: tokens.borderRadiusCircular,
          border: `1px solid ${tokens.colorBrandForeground1}`,
          opacity: 0.35,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: ring2,
          borderRadius: tokens.borderRadiusCircular,
          border: `1px solid ${tokens.colorBrandForeground1}`,
          opacity: 0.6,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: dot,
          borderRadius: tokens.borderRadiusCircular,
          backgroundColor: tokens.colorBrandForeground1,
        }}
      />
    </span>
  );
};
