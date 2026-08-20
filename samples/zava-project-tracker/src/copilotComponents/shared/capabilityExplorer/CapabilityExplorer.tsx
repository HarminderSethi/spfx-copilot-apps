import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles, mergeClasses } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import {
  ArrowLeft20Regular,
  ArrowRight20Regular,
  Checkmark20Regular,
  Copy20Regular,
  Search20Regular
} from '@fluentui/react-icons';

import { PROJECT_INTENT_CATALOG } from '../mockData/intentCatalog';
import type { IProjectIntentProperties, ProjectWorkspace } from '../models/projectPortfolio';
import CapabilityPreview from './CapabilityPreview';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 },
  toolbar: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  search: { flexGrow: 1, minWidth: '180px', display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', gap: '6px', alignItems: 'center', padding: '6px 8px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  input: { minWidth: 0, border: 'none', outlineStyle: 'none', color: tokens.colorNeutralForeground1, backgroundColor: 'transparent' },
  select: { minHeight: '34px', padding: '6px 8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  categories: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  category: { minHeight: '32px', padding: '5px 9px', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer' },
  categoryActive: { color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground },
  layout: { display: 'grid', gridTemplateColumns: 'minmax(190px, .72fr) minmax(0, 1.28fr)', gap: '12px', alignItems: 'start' },
  fullscreenLayout: { gridTemplateColumns: 'minmax(240px, .52fr) minmax(0, 1.48fr)' },
  compact: { gridTemplateColumns: 'minmax(0, 1fr)' },
  list: { display: 'flex', flexDirection: 'column', maxHeight: '520px', overflowY: 'auto', borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  scenario: { display: 'flex', flexDirection: 'column', gap: '3px', padding: '9px 7px', textAlign: 'left', color: tokens.colorNeutralForeground1, backgroundColor: 'transparent', border: 'none', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, cursor: 'pointer' },
  scenarioActive: { backgroundColor: tokens.colorBrandBackground2 },
  detail: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 },
  fullscreenPreviewViewport: { width: '100%', maxWidth: '760px', alignSelf: 'center' },
  eyebrow: { color: tokens.colorBrandForeground1, fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightBold },
  muted: { color: tokens.colorNeutralForeground3 },
  badges: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  badge: { width: 'fit-content', padding: '3px 7px', color: tokens.colorBrandForeground1, backgroundColor: tokens.colorBrandBackground2, borderRadius: tokens.borderRadiusCircular, fontSize: tokens.fontSizeBase100 },
  prompt: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px', borderLeft: `3px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorNeutralBackground2 },
  promptText: { width: '100%', minHeight: '52px', resize: 'vertical', boxSizing: 'border-box', padding: '7px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, fontFamily: tokens.fontFamilyBase },
  actions: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
  primary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: 'none', borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  secondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '34px', padding: '7px 11px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, fontWeight: tokens.fontWeightSemibold, cursor: 'pointer' },
  noMatch: { padding: '16px', textAlign: 'center', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium }
});

const categoryLabels: Readonly<Record<Exclude<ProjectWorkspace, 'education'> | 'all', string>> = {
  all: 'All scenarios',
  'my-work': 'My Work',
  project: 'Project delivery',
  portfolio: 'Portfolio decisions',
  approvals: 'Approvals'
};
const categoryKeys: ReadonlyArray<keyof typeof categoryLabels> = ['all', 'my-work', 'project', 'portfolio', 'approvals'];
const operationLabels = {
  information: 'Explore an insight',
  review: 'Review a decision',
  submit: 'Prepare an update or request'
};

const advertised = PROJECT_INTENT_CATALOG.filter((definition) => Boolean(definition.education));

export interface ICapabilityExplorerProps {
  properties: IProjectIntentProperties;
  compact: boolean;
  fullscreen: boolean;
}

const CapabilityExplorerBody: React.FunctionComponent<ICapabilityExplorerProps> = ({ properties, compact, fullscreen }) => {
  const styles = useStyles();
  const requestedCategory = String(properties.category || 'all');
  const initialCategory = Object.prototype.hasOwnProperty.call(categoryLabels, requestedCategory) ? requestedCategory as keyof typeof categoryLabels : 'all';
  const [category, setCategory] = React.useState<keyof typeof categoryLabels>(initialCategory);
  const [query, setQuery] = React.useState(String(properties.query || ''));
  const [audience, setAudience] = React.useState(String(properties.audience || 'all'));
  const [featuredOnly, setFeaturedOnly] = React.useState(String(properties.tour || '') === 'featured');
  const [selectedKey, setSelectedKey] = React.useState(String(properties.scenarioKey || 'GetMyWorkSummary'));
  const [copyState, setCopyState] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  const audiences = Array.from(new Set(advertised.reduce<string[]>((result, definition) => result.concat(definition.education?.audience || []), []))).sort();
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = advertised.filter((definition) => {
    const education = definition.education!;
    const matchesCategory = category === 'all' || education.category === category;
    const matchesAudience = !fullscreen || audience === 'all' || education.audience.indexOf(audience) >= 0;
    const matchesFeatured = !fullscreen || !featuredOnly || education.featuredRank !== undefined;
    const searchable = [education.scenarioName, education.businessOutcome, education.examplePrompt, ...education.tags].join(' ').toLowerCase();
    return matchesCategory && matchesAudience && matchesFeatured && (!normalizedQuery || searchable.indexOf(normalizedQuery) >= 0);
  }).sort((left, right) => (left.education?.featuredRank || 999) - (right.education?.featuredRank || 999) || left.title.localeCompare(right.title));
  const selected = filtered.find((definition) => definition.key === selectedKey) || filtered[0];
  const selectedIndex = selected ? filtered.indexOf(selected) : -1;

  const copyPrompt = async (): Promise<void> => {
    if (!selected?.education) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(selected.education.examplePrompt);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };
  const resetFilters = (): void => {
    setCategory('all'); setQuery(''); setAudience('all'); setFeaturedOnly(false); setCopyState('idle');
  };
  const selectRelative = (offset: number): void => {
    if (filtered.length === 0) return;
    const nextIndex = (selectedIndex + offset + filtered.length) % filtered.length;
    setSelectedKey(filtered[nextIndex].key); setCopyState('idle');
  };

  return <div className={styles.stack} data-layout={fullscreen ? 'capability-explorer-fullscreen' : 'capability-explorer-inline'}>
    <Text size={400} weight="semibold">What are you trying to accomplish?</Text>
    <div className={styles.toolbar}>
      <label className={styles.search}><Search20Regular aria-hidden="true"/><input aria-label="Search scenarios" className={styles.input} value={query} placeholder="Search outcomes or prompts" onChange={(event) => { setQuery(event.currentTarget.value); setCopyState('idle'); }}/></label>
      {fullscreen && <select aria-label="Filter by audience" className={styles.select} value={audience} onChange={(event) => setAudience(event.currentTarget.value)}><option value="all">All audiences</option>{audiences.map((item) => <option value={item} key={item}>{item}</option>)}</select>}
      {fullscreen && <button type="button" aria-pressed={featuredOnly} className={mergeClasses(styles.secondary, featuredOnly && styles.categoryActive)} onClick={() => setFeaturedOnly((current) => !current)}>Featured tour</button>}
    </div>
    <div className={styles.categories} role="group" aria-label="Scenario categories">{categoryKeys.map((key) => { const count = advertised.filter((definition) => key === 'all' || definition.education?.category === key).length; return <button type="button" key={key} aria-pressed={category === key} className={mergeClasses(styles.category, category === key && styles.categoryActive)} onClick={() => { setCategory(key); setCopyState('idle'); }}>{categoryLabels[key]} ({count})</button>; })}</div>
    {filtered.length === 0 ? <div className={styles.noMatch} role="status"><Text weight="semibold" block>No scenarios match</Text><Text size={200} block className={styles.muted}>Try a broader search, category, or audience.</Text><button type="button" className={styles.secondary} onClick={resetFilters}>Reset filters</button></div> : selected && selected.education && <div className={mergeClasses(styles.layout, fullscreen && styles.fullscreenLayout, compact && styles.compact)}>
      <nav className={styles.list} aria-label="Available scenarios">{filtered.map((definition) => <button type="button" data-scenario-key={definition.key} key={definition.key} aria-current={selected.key === definition.key ? 'true' : undefined} className={mergeClasses(styles.scenario, selected.key === definition.key && styles.scenarioActive)} onClick={() => { setSelectedKey(definition.key); setCopyState('idle'); }}><Text weight="semibold">{definition.education!.scenarioName}</Text><Text size={100} className={styles.muted}>{definition.education!.businessOutcome}</Text></button>)}</nav>
      <section className={styles.detail} aria-live="polite">
        <Text className={styles.eyebrow}>{categoryLabels[selected.education.category]} / {operationLabels[selected.education.operation]}</Text>
        <Text size={500} weight="semibold">{selected.education.scenarioName}</Text>
        <Text size={200}>{selected.education.businessOutcome}</Text>
        <div className={styles.badges}>{selected.education.audience.map((item) => <span className={styles.badge} key={item}>{item}</span>)}<span className={styles.badge}>{selected.education.previewSafety === 'read-only' ? 'Explore safely' : 'Preview stops before action'}</span></div>
        <div className={styles.prompt}><Text size={100} className={styles.muted}>Try asking</Text><textarea aria-label="Suggested prompt" className={styles.promptText} readOnly value={selected.education.examplePrompt}/><div className={styles.actions}><button type="button" className={styles.primary} onClick={copyPrompt}>{copyState === 'copied' ? <Checkmark20Regular/> : <Copy20Regular/>}{copyState === 'copied' ? 'Prompt copied' : 'Copy prompt'}</button>{copyState === 'failed' && <Text role="alert" size={100}>Clipboard access is unavailable. Select the prompt text and copy it manually.</Text>}<Text size={100} className={styles.muted}>Paste or send this prompt in the current conversation to open the full experience.</Text></div></div>
        {fullscreen && <div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => selectRelative(-1)}><ArrowLeft20Regular/> Previous</button><Text size={100} className={styles.muted}>{selectedIndex + 1} of {filtered.length}</Text><button type="button" className={styles.secondary} onClick={() => selectRelative(1)}>Next <ArrowRight20Regular/></button></div>}
        {fullscreen
          ? <div className={styles.fullscreenPreviewViewport} data-layout="capability-preview-viewport"><CapabilityPreview key={selected.key} definition={selected} properties={selected.education.previewProperties} compact={compact}/></div>
          : <CapabilityPreview key={selected.key} definition={selected} properties={selected.education.previewProperties} compact={compact}/>
        }
      </section>
    </div>}
  </div>;
};

interface ICapabilityExplorerErrorState { hasError: boolean }

const CapabilityExplorerErrorFallback: React.FunctionComponent<{ onRetry: () => void }> = ({ onRetry }) => {
  const styles = useStyles();
  return <div data-layout="capability-explorer-error" role="alert"><Text weight="semibold" block>Unable to load the scenario guide</Text><Text size={200} block>Try the guide again, or ask Zava what it can help you accomplish.</Text><button type="button" className={styles.secondary} onClick={onRetry}>Try again</button></div>;
};

export class CapabilityExplorerErrorBoundary extends React.Component<{ children: React.ReactNode }, ICapabilityExplorerErrorState> {
  public state: ICapabilityExplorerErrorState = { hasError: false };

  public static getDerivedStateFromError(): ICapabilityExplorerErrorState {
    return { hasError: true };
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return <CapabilityExplorerErrorFallback onRetry={() => this.setState({ hasError: false })}/>;
    }
    return this.props.children;
  }
}

const CapabilityExplorer: React.FunctionComponent<ICapabilityExplorerProps> = (props) => <CapabilityExplorerErrorBoundary><CapabilityExplorerBody {...props}/></CapabilityExplorerErrorBoundary>;

export default CapabilityExplorer;
