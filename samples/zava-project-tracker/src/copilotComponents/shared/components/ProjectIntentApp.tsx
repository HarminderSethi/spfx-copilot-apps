import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { ArrowMaximize24Regular } from '@fluentui/react-icons';
import { makeStyles, mergeClasses } from '@griffel/react';

import type { IIntentDefinition, IProjectIntentProperties } from '../models/projectPortfolio';
import type { IIntentTransientState } from '../models/intentInvocation';
import ProjectFullscreenShell from './fullscreen/ProjectFullscreenShell';
import InlineExperienceRouter from './inline/InlineExperienceRouter';

const useStyles = makeStyles({
  provider: {
    width: '100%',
    minWidth: 0,
    color: 'inherit',
    backgroundColor: 'transparent'
  },
  root: {
    position: 'relative',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: '8px',
    border: '1px solid var(--colorNeutralStroke2)',
    backgroundColor: 'var(--colorNeutralBackground1)',
    boxShadow: 'var(--shadow4)',
    fontFamily: 'var(--fontFamilyBase)'
  },
  accent: {
    height: '6px',
    backgroundImage: 'linear-gradient(90deg, var(--colorBrandBackground) 0%, var(--colorPaletteGreenBackground3) 68%, var(--colorPaletteMarigoldBackground3) 100%)',
    boxShadow: 'inset 0 -1px 0 rgba(255, 255, 255, .28)'
  },
  projectAccent: {
    backgroundImage: 'linear-gradient(90deg, var(--colorBrandBackground) 0%, var(--colorPaletteBerryBackground3) 54%, var(--colorPaletteGreenBackground3) 100%)'
  },
  portfolioAccent: {
    backgroundImage: 'linear-gradient(90deg, var(--colorPaletteGreenBackground3) 0%, var(--colorPaletteLightGreenBackground3) 44%, var(--colorBrandBackground) 100%)'
  },
  approvalsAccent: {
    backgroundImage: 'linear-gradient(90deg, var(--colorPaletteDarkOrangeBackground3) 0%, var(--colorPaletteMarigoldBackground3) 28%, var(--colorPaletteRedBackground3) 62%, var(--colorPaletteBerryBackground3) 100%)'
  },
  educationAccent: {
    backgroundImage: 'linear-gradient(90deg, var(--colorBrandBackground) 0%, var(--colorPaletteBerryBackground3) 52%, var(--colorPaletteMarigoldBackground3) 100%)'
  },
  canvas: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '18px',
    '@media (max-width: 520px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      padding: '15px'
    }
  },
  canvasCompact: {
    padding: '15px'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px'
  },
  headingBlock: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  eyebrow: {
    color: 'var(--colorBrandForeground1)',
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: '16px'
  },
  title: {
    color: 'var(--colorNeutralForeground1)',
    fontSize: '20px',
    fontWeight: 650,
    lineHeight: '25px'
  },
  summary: {
    maxWidth: '610px',
    color: 'var(--colorNeutralForeground2)',
    fontSize: '13px',
    lineHeight: '19px'
  },
  expand: {
    flexShrink: 0,
    appearance: 'none',
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: '1px solid transparent',
    borderRadius: '4px',
    color: 'var(--colorNeutralForeground2)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    ':hover': { backgroundColor: 'var(--colorNeutralBackground2)' },
    ':focus-visible': {
      outline: '2px solid var(--colorStrokeFocus2)',
      outlineOffset: '2px'
    }
  },
  status: {
    color: 'var(--colorNeutralForeground3)',
    fontSize: '11px'
  }
});

export interface IProjectIntentAppProps {
  definition: IIntentDefinition;
  properties: IProjectIntentProperties;
  propertiesVersion?: number;
  transientState?: IIntentTransientState;
  onTransientStateChange?: (state: IIntentTransientState) => void;
  currentUserName: string;
  currentUserImageUrl?: string;
  containerWidth?: number;
  displayMode?: string;
  onRequestFullscreen?: () => void;
}

const ProjectIntentApp: React.FunctionComponent<IProjectIntentAppProps> = (props) => {
  const styles = useStyles();
  const accentClass = props.definition.workspace === 'project' ? styles.projectAccent :
    props.definition.workspace === 'portfolio' ? styles.portfolioAccent :
    props.definition.workspace === 'approvals' ? styles.approvalsAccent :
    props.definition.workspace === 'education' ? styles.educationAccent : undefined;
  const promptContext = props.properties.projectId || props.properties.portfolioId || props.properties.period;
  const compact = props.containerWidth !== undefined && props.containerWidth <= 520;

  if (props.displayMode === 'fullscreen' && props.definition.workspace !== 'education') {
    return <ProjectFullscreenShell initialDefinition={props.definition} initialProperties={props.properties} propertiesVersion={props.propertiesVersion} transientState={props.transientState} currentUserName={props.currentUserName} currentUserImageUrl={props.currentUserImageUrl} containerWidth={props.containerWidth}/>;
  }

  return (
    <div className={styles.provider}>
      <section className={styles.root} data-intent={props.definition.key} data-workspace={props.definition.workspace}>
        <div className={mergeClasses(styles.accent, accentClass)} aria-hidden="true" />
        <div className={mergeClasses(styles.canvas, compact && styles.canvasCompact)}>
          <header className={styles.header}>
              <div className={styles.headingBlock}>
                <Text className={styles.eyebrow}>{props.definition.eyebrow} / {props.currentUserName}</Text>
                <Text as="h2" className={styles.title}>{props.definition.title}</Text>
                <Text className={styles.summary}>{props.definition.summary}</Text>
              </div>
              {props.onRequestFullscreen && (
                <button className={styles.expand} type="button" title="View in full screen" aria-label="View in full screen" onClick={props.onRequestFullscreen}>
                  <ArrowMaximize24Regular aria-hidden="true" />
                </button>
              )}
          </header>
          <InlineExperienceRouter {...props} compact={compact} />
          <Text className={styles.status}>{promptContext ? `Filtered by ${String(promptContext)}` : props.definition.status}</Text>
        </div>
      </section>
    </div>
  );
};

export default ProjectIntentApp;