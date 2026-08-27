import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';

import { getZavaFamily } from '../models/families';
import type { ZavaFamilyId } from '../models/families';
import { getZavaFamilyTheme } from '../theme/familyThemes';

const useStyles = makeStyles({
  root: { display: 'inline-flex', alignItems: 'center', padding: '3px 7px', borderRadius: tokens.borderRadiusCircular, fontWeight: tokens.fontWeightSemibold }
});

export interface IFamilyBadgeProps {
  family: ZavaFamilyId;
  compact?: boolean;
}

const FamilyBadge: React.FunctionComponent<IFamilyBadgeProps> = ({ family, compact }) => {
  const styles = useStyles();
  const metadata = getZavaFamily(family);
  const theme = getZavaFamilyTheme(metadata.themeVariant);
  return (
    <Text
      size={100}
      className={styles.root}
      style={{ color: theme.foregroundColor, backgroundColor: theme.subtleBackgroundColor }}
    >
      {compact ? metadata.railLabel : metadata.label}
    </Text>
  );
};

export default FamilyBadge;