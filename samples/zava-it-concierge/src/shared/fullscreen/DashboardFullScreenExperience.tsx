import * as React from 'react';
import { Badge, Button } from '@fluentui/react-components';
import { ArrowMinimize24Regular, Building24Regular, Laptop24Regular, PeopleTeam24Regular, Person24Regular } from '@fluentui/react-icons';

import type { IIntentDefinition } from '../intents/intentCatalog';
import { getDefaultFullScreenIntent, resolveFullScreenLens } from './fullScreenCatalog';
import type { FullScreenLens } from './fullScreenCatalog';
import { PersonalDashboard, PortfolioDashboard, TeamDashboard } from './DashboardViews';

import styles from './FullScreenExperience.module.scss';

export interface IDashboardFullScreenExperienceProps {
  readonly intent: IIntentDefinition;
  readonly isDark: boolean;
  readonly ownerWindow: Window | undefined;
  readonly properties: Readonly<Record<string, unknown>>;
  readonly userName: string;
  readonly onExit: () => void;
}

const LENS_ORDER: readonly FullScreenLens[] = ['personal', 'team', 'portfolio'];
const LENS_LABELS: Readonly<Record<FullScreenLens, string>> = { personal: 'Personal', team: 'Team', portfolio: 'IT portfolio' };
const LENS_TITLES: Readonly<Record<FullScreenLens, string>> = { personal: 'My IT workspace', team: 'Team operations', portfolio: 'IT control center' };

function LensIcon(props: { readonly lens: FullScreenLens }): React.ReactElement {
  if (props.lens === 'team') return <PeopleTeam24Regular />;
  if (props.lens === 'portfolio') return <Building24Regular />;
  return <Person24Regular />;
}

export function DashboardFullScreenExperience(props: IDashboardFullScreenExperienceProps): React.ReactElement {
  const originLens = resolveFullScreenLens(props.intent);
  const [activeLens, setActiveLens] = React.useState<FullScreenLens>(originLens);
  const mainRef = React.useRef<HTMLElement>(null);
  const dashboardOrigin = activeLens === originLens ? props.intent : getDefaultFullScreenIntent(activeLens);
  const dashboardProperties = activeLens === originLens ? props.properties : {};

  const selectLens = (lens: FullScreenLens): void => {
    setActiveLens(lens);
    props.ownerWindow?.requestAnimationFrame(() => mainRef.current?.focus());
  };
  const moveLens = (current: FullScreenLens, direction: number): void => {
    const currentIndex = LENS_ORDER.indexOf(current);
    const nextIndex = (currentIndex + direction + LENS_ORDER.length) % LENS_ORDER.length;
    selectLens(LENS_ORDER[nextIndex]);
  };

  return (
    <div className={`${styles.shell} ${props.isDark ? styles.dark : ''}`} data-lens={activeLens}>
      <aside className={styles.lensRail} aria-label="IT Concierge lenses">
        <div className={styles.brand}><span className={styles.brandMark} aria-hidden="true" /><span>Zava<strong>IT Concierge</strong></span></div>
        <div className={styles.lensTabs} role="tablist" aria-orientation="vertical">
          {LENS_ORDER.map((lens) => (
            <button
              aria-controls={`zava-${lens}-dashboard`}
              aria-label={LENS_LABELS[lens]}
              aria-selected={activeLens === lens}
              id={`zava-${lens}-tab`}
              key={lens}
              onClick={() => selectLens(lens)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); moveLens(lens, 1); }
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); moveLens(lens, -1); }
              }}
              role="tab"
              tabIndex={activeLens === lens ? 0 : -1}
              type="button"
            >
              <LensIcon lens={lens} /><span>{LENS_LABELS[lens]}</span>
            </button>
          ))}
        </div>
        <div className={styles.railStatus}><span>Mock workspace</span><strong>Offline and safe</strong></div>
      </aside>
      <main
        aria-labelledby={`zava-${activeLens}-tab`}
        className={styles.workspace}
        id={`zava-${activeLens}-dashboard`}
        ref={mainRef}
        role="tabpanel"
        tabIndex={-1}
      >
        <header className={styles.productBar}>
          <div><span>{LENS_LABELS[activeLens]} dashboard</span><strong>{LENS_TITLES[activeLens]}</strong></div>
          <div className={styles.productActions}><Badge appearance="tint" className={styles.liveStatus} color="informative">Live operating picture</Badge><Button appearance="subtle" className={styles.backButton} icon={<ArrowMinimize24Regular />} onClick={props.onExit}>Back to conversation</Button></div>
        </header>
        {activeLens === 'personal' && <PersonalDashboard isDark={props.isDark} originIntent={dashboardOrigin} ownerWindow={props.ownerWindow} properties={dashboardProperties} />}
        {activeLens === 'team' && <TeamDashboard isDark={props.isDark} originIntent={dashboardOrigin} ownerWindow={props.ownerWindow} properties={dashboardProperties} />}
        {activeLens === 'portfolio' && <PortfolioDashboard isDark={props.isDark} originIntent={dashboardOrigin} ownerWindow={props.ownerWindow} properties={dashboardProperties} />}
        <footer className={styles.footer}><span><Laptop24Regular /> Prepared for {props.userName}</span><span>Dashboard data as of 2026-08-22</span></footer>
      </main>
    </div>
  );
}