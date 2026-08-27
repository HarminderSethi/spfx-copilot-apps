import * as React from 'react';
import { Button, Input, Select } from '@fluentui/react-components';
import { CheckmarkCircle20Filled, DocumentBulletList20Regular, Search20Regular, Warning20Regular } from '@fluentui/react-icons';

import { PERSONA_MEDIA, SURFACE_PRODUCT_MEDIA } from '../assets/mediaCatalog';
import { INTENT_CATALOG } from '../intents/intentCatalog';
import { FEATURED_CAPABILITY_NAMES, getCapabilityMatches, getCapabilityPage } from './capabilityExplorerModel';
import type { IExperienceItem, IExperiencePresentation } from './experiencePresentations';

import styles from './IntentCanvasApp.module.scss';

export interface IInlineExperienceDetailsProps {
  readonly presentation: IExperiencePresentation;
  readonly ownerWindow: Window | undefined;
}

function StatusIcon(props: { readonly tone?: string }): React.ReactElement {
  return props.tone === 'warning' || props.tone === 'danger' ? <Warning20Regular aria-hidden="true" /> : <CheckmarkCircle20Filled aria-hidden="true" />;
}

function PersonaImage(props: { readonly item: IExperienceItem }): React.ReactElement {
  if (!props.item.persona) {
    return <></>;
  }
  const media = PERSONA_MEDIA[props.item.persona];
  return <img className={styles.personaImage} src={media.src} alt={media.alt} />;
}

function ItemList(props: { readonly items: readonly IExperienceItem[]; readonly ordered?: boolean }): React.ReactElement {
  const List = props.ordered ? 'ol' : 'ul';
  return (
    <List className={props.ordered ? styles.journeyList : styles.detailList}>
      {props.items.map((entry) => (
        <li className={styles.detailItem} data-tone={entry.tone} key={entry.id}>
          <PersonaImage item={entry} />
          <span className={styles.statusIcon}><StatusIcon tone={entry.tone} /></span>
          <span className={styles.detailCopy}><strong>{entry.label}</strong>{entry.detail && <small>{entry.detail}</small>}</span>
          <span className={styles.detailValue}>{entry.value}</span>
        </li>
      ))}
    </List>
  );
}

function SurfaceFallback(props: { readonly itemId: string }): React.ReactElement {
  const family = props.itemId.indexOf('studio') >= 0 ? 'Studio' : props.itemId.indexOf('hub') >= 0 ? 'Hub' : 'Go';
  return <span className={styles.surfaceFallback} data-family={family} aria-label={`Microsoft Surface ${family} product image pending`}><span>{family}</span></span>;
}

function SurfaceCatalogDetails(props: { readonly items: readonly IExperienceItem[] }): React.ReactElement {
  const recommended = props.items.find((entry) => entry.tone === 'success') ?? props.items[0];
  const [selectedId, setSelectedId] = React.useState(recommended.id);
  const selected = props.items.find((entry) => entry.id === selectedId) ?? recommended;
  const media = SURFACE_PRODUCT_MEDIA[selected.id];
  return (
    <div className={styles.surfaceShowcase}>
      <div className={styles.surfaceHero}>
        <div className={styles.surfaceMedia}>{media ? <img src={media.src} alt={media.alt} /> : <SurfaceFallback itemId={selected.id} />}</div>
        <div className={styles.surfaceCopy}>
          <p className={styles.insightLabel}>{selected.tone === 'success' ? 'Recommended for this role' : 'Surface device offering'}</p>
          <strong>{selected.label}</strong>
          <span>{selected.detail}</span>
          <b>{selected.value}</b>
        </div>
      </div>
      <div className={styles.surfaceRail} aria-label="Surface device offerings">
        {props.items.map((entry) => {
          const entryMedia = SURFACE_PRODUCT_MEDIA[entry.id];
          return (
            <button aria-pressed={entry.id === selected.id} key={entry.id} onClick={() => setSelectedId(entry.id)} type="button">
              {entryMedia ? <img src={entryMedia.src} alt="" /> : <SurfaceFallback itemId={entry.id} />}
              <span><strong>{entry.label}</strong><small>{entry.value}</small></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function KnowledgeCatalogDetails(props: { readonly items: readonly IExperienceItem[] }): React.ReactElement {
  return <div className={styles.knowledgeList}>{props.items.map((entry) => <div className={styles.knowledgeItem} key={entry.id}><DocumentBulletList20Regular aria-hidden="true" /><span><strong>{entry.label}</strong><small>{entry.detail}</small></span><b>{entry.value}</b></div>)}</div>;
}

async function copyPrompt(ownerWindow: Window | undefined, prompt: string): Promise<boolean> {
  if (!ownerWindow) {
    return false;
  }
  try {
    if (ownerWindow.navigator.clipboard) {
      await ownerWindow.navigator.clipboard.writeText(prompt);
      return true;
    }
    const textArea = ownerWindow.document.createElement('textarea');
    textArea.value = prompt;
    ownerWindow.document.body.appendChild(textArea);
    textArea.select();
    const copied = ownerWindow.document.execCommand('copy');
    textArea.remove();
    return copied;
  } catch {
    return false;
  }
}

function CapabilityDetails(props: { readonly ownerWindow: Window | undefined }): React.ReactElement {
  const [query, setQuery] = React.useState('');
  const [lens, setLens] = React.useState('all');
  const [operation, setOperation] = React.useState('all');
  const [page, setPage] = React.useState(0);
  const [featuredIndex, setFeaturedIndex] = React.useState(-1);
  const [selectedIntentName, setSelectedIntentName] = React.useState<string>();
  const [copyStatus, setCopyStatus] = React.useState('');
  const matches = getCapabilityMatches({ query, lens, operation });
  const capabilityPage = getCapabilityPage(matches, page);
  const pageCount = capabilityPage.pageCount;
  const visibleMatches = capabilityPage.items;
  const selectedIntent = INTENT_CATALOG.find((intent) => intent.name === selectedIntentName);

  React.useEffect(() => setPage(0), [query, lens, operation]);

  return (
    <div className={styles.capabilityExplorer}>
      <Input aria-label="Search capabilities" className={styles.capabilitySearch} contentBefore={<Search20Regular />} placeholder="Search IT scenarios" value={query} onChange={(_event, data) => setQuery(data.value)} />
      <div className={styles.capabilityFilters}>
        <Select aria-label="Filter by audience" className={styles.capabilitySelect} value={lens} onChange={(event) => setLens(event.target.value)}>
          <option value="all">All audiences</option>
          <option value="me">Me</option>
          <option value="team">Team</option>
          <option value="company">Company</option>
          <option value="contextual">Contextual</option>
        </Select>
        <Select aria-label="Filter by operation" className={styles.capabilitySelect} value={operation} onChange={(event) => setOperation(event.target.value)}>
          <option value="all">All operations</option>
          <option value="information">Information</option>
          <option value="review">Review</option>
          <option value="submit">Submit</option>
        </Select>
      </div>
      <div className={styles.capabilityResults} aria-live="polite">
        {visibleMatches.map((intent) => (
          <div key={intent.name}>
            <span><strong>{intent.title}</strong><small>{intent.lens} / {intent.operation}</small></span>
            <Button
              appearance="subtle"
              aria-pressed={selectedIntentName === intent.name}
              className={`${styles.capabilityButton} ${styles.capabilityButtonSubtle}`}
              onClick={() => {
                setSelectedIntentName(intent.name);
                setCopyStatus('');
              }}
              size="small"
            >
              Preview prompt
            </Button>
          </div>
        ))}
        {visibleMatches.length === 0 && <span className={styles.emptyResult}>No capabilities match these filters.</span>}
      </div>
      <div className={styles.capabilityPager}>
        <Button className={styles.capabilityButton} disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} size="small">Previous</Button>
        <span>Page {page + 1} of {pageCount}</span>
        <Button className={styles.capabilityButton} disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} size="small">Next</Button>
        <Button
          appearance="subtle"
          className={`${styles.capabilityButton} ${styles.capabilityButtonSubtle}`}
          onClick={() => {
            const nextIndex = (featuredIndex + 1) % FEATURED_CAPABILITY_NAMES.length;
            setFeaturedIndex(nextIndex);
            setSelectedIntentName(FEATURED_CAPABILITY_NAMES[nextIndex]);
            setCopyStatus('');
          }}
          size="small"
        >
          {featuredIndex < 0 ? 'Start featured tour' : 'Next featured'}
        </Button>
      </div>
      {selectedIntent && (
        <div className={styles.capabilityPreview}>
          <p className={styles.insightLabel}>Prompt preview</p>
          <strong>{selectedIntent.title}</strong>
          <span>{selectedIntent.education.samplePrompt}</span>
          <small>{selectedIntent.lens} / {selectedIntent.operation} / read-only preview</small>
          <Button
            appearance="primary"
            className={`${styles.capabilityButton} ${styles.capabilityButtonPrimary}`}
            onClick={() => {
              copyPrompt(props.ownerWindow, selectedIntent.education.samplePrompt).then((copied) => setCopyStatus(copied ? 'Prompt copied.' : 'Prompt is ready to select and copy.')).catch(() => setCopyStatus('Prompt is ready to select and copy.'));
            }}
            size="small"
          >
            Copy prompt
          </Button>
          <span aria-live="polite">{copyStatus}</span>
        </div>
      )}
    </div>
  );
}

export function InlineExperienceDetails(props: IInlineExperienceDetailsProps): React.ReactElement {
  if (props.presentation.profile === 'education') {
    return <CapabilityDetails ownerWindow={props.ownerWindow} />;
  }
  if (props.presentation.profile === 'catalog') {
    return props.presentation.items.some((entry) => entry.id.indexOf('surface-') === 0)
      ? <SurfaceCatalogDetails items={props.presentation.items} />
      : <KnowledgeCatalogDetails items={props.presentation.items} />;
  }
  if (props.presentation.profile === 'journey') {
    return <ItemList items={props.presentation.items} ordered />;
  }
  return <ItemList items={props.presentation.items} />;
}