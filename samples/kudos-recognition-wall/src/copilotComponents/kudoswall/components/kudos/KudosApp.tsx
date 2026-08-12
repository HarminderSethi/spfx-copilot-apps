import * as React from 'react';
import {
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  FluentProvider,
  IdPrefixProvider,
  type Theme,
} from '@fluentui/react-components';
import { KudosInlineCard, type InlineCardMode } from './KudosInlineCard';
import { RecognitionWall } from './RecognitionWall';
import { RecipientPicker } from './RecipientPicker';
import { useKudos } from './hooks/useKudos';
import type { IKudosService, IPerson, ISendKudosInput } from './models/kudos.types';
import type { IPeopleService } from './services/IPeopleService';
import { getBrandTheme } from '../../../../theme/theme';

export type KudosSurface = 'inline' | 'fullscreen';

export interface IKudosAppProps {
  /** 'inline' in the chat conversation, 'fullscreen' when the canvas expands. */
  surface: KudosSurface;
  /** 'launcher' for a generic invocation, 'compose' when the prompt named someone. */
  inlineMode?: InlineCardMode;
  recipient?: IPerson;
  prefilledMessage?: string;
  service: IKudosService;
  peopleService: IPeopleService;
  /** Host theme; falls back to the AM light/dark theme. */
  theme?: Theme;
  isDarkTheme?: boolean;
  /** The document the FluentProvider injects styles into (the Copilot iframe). */
  targetDocument?: Document;
  /** Ask the Copilot host to expand this component to the full canvas. */
  onRequestFullscreen?: () => void;
}

export const KudosApp: React.FC<IKudosAppProps> = ({
  surface,
  inlineMode = 'compose',
  recipient,
  prefilledMessage = '',
  service,
  peopleService,
  theme,
  isDarkTheme = false,
  targetDocument,
  onRequestFullscreen,
}) => {
  const { filters, kudos, mostRecognised, topGivers, departments, loading, setFilters, send } =
    useKudos(service);

  const [selectedRecipient, setSelectedRecipient] = React.useState<IPerson | undefined>(recipient);
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  // Keep in step if the host resolves a recipient after first render.
  React.useEffect(() => setSelectedRecipient(recipient), [recipient]);

  const handleSend = React.useCallback(
    async (input: ISendKudosInput): Promise<void> => {
      await send(input);
    },
    [send],
  );

  const resolvedTheme = theme ?? getBrandTheme(isDarkTheme);

  const composeCard = (
    <KudosInlineCard
      initialMode="compose"
      recipient={selectedRecipient}
      recentKudos={kudos.slice(0, 3)}
      teams={departments}
      onSend={handleSend}
      onChangeRecipient={() => setPickerOpen(true)}
      onCancel={() => setComposeOpen(false)}
      spacious
    />
  );

  return (
    <IdPrefixProvider value="kudoswall-">
      <FluentProvider
        theme={resolvedTheme}
        targetDocument={targetDocument}
        style={{ width: '100%', height: '100%' }}
      >
        {surface === 'inline' ? (
          <KudosInlineCard
            initialMode={inlineMode}
            recipient={selectedRecipient}
            initialMessage={prefilledMessage}
            recentKudos={kudos.slice(0, 3)}
            totalThisMonth={kudos.length}
            teams={departments}
            onSend={handleSend}
            onChangeRecipient={() => setPickerOpen(true)}
            onOpenWall={onRequestFullscreen}
          />
        ) : (
          <>
            <RecognitionWall
              kudos={kudos}
              mostRecognised={mostRecognised}
              topGivers={topGivers}
              departments={departments}
              filters={filters}
              loading={loading}
              onFiltersChange={setFilters}
              onGiveKudos={() => setComposeOpen(true)}
            />
            <Dialog open={composeOpen} onOpenChange={(_, d) => setComposeOpen(d.open)}>
              <DialogSurface
                style={{ maxWidth: 520, padding: 0, background: 'transparent', border: 0, boxShadow: 'none' }}
              >
                {/* Fluent's DialogBody is a 3-column grid that would squeeze the card
                    into one cell — override to block so the card spans the surface. */}
                <DialogBody style={{ padding: 0, display: 'block' }}>
                  {/* Same compose experience as the inline card — one component. */}
                  {composeCard}
                </DialogBody>
              </DialogSurface>
            </Dialog>
          </>
        )}

        {/* Shared recipient picker for both surfaces. */}
        <Dialog open={pickerOpen} onOpenChange={(_, d) => setPickerOpen(d.open)}>
          <DialogSurface style={{ maxWidth: 420 }}>
            <DialogBody style={{ display: 'block' }}>
              <DialogTitle style={{ marginBottom: 12 }}>Choose a colleague</DialogTitle>
              <RecipientPicker
                peopleService={peopleService}
                onPick={(person) => {
                  setSelectedRecipient(person);
                  setPickerOpen(false);
                }}
              />
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </FluentProvider>
    </IdPrefixProvider>
  );
};
