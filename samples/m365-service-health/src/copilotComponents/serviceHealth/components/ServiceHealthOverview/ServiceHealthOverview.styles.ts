import { makeStyles, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS
  },
  search: {
    minWidth: '180px',
    flexGrow: 1,
    maxWidth: '280px'
  },
  count: {
    color: tokens.colorNeutralForeground3
  },
  drawer: {
    maxWidth: 'min(560px, 100vw)'
  },
  drawerSubtitle: {
    color: tokens.colorNeutralForeground3
  }
});
