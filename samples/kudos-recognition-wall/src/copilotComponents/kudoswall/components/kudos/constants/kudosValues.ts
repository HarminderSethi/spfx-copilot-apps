import { tokens } from '@fluentui/react-components';
import type { KudosValueKey } from '../models/kudos.types';

/**
 * The four recognised values, colour-coded consistently across chips, feed
 * cards and the leaderboard.
 *
 * These are Fluent v9 *palette* tokens, not literals: each one already carries
 * a light and a dark ramp, so the whole component flips theme with no branching
 * and stays AA in both. Foreground2/Background2 is the accessible pairing.
 */
export interface IKudosValueMeta {
  key: KudosValueKey;
  label: string;
  foreground: string;
  background: string;
  /** Solid accent for the card's left edge. */
  accent: string;
}

export const KUDOS_VALUES: Record<KudosValueKey, IKudosValueMeta> = {
  teamwork: {
    key: 'teamwork',
    label: 'Teamwork',
    foreground: tokens.colorPaletteBlueForeground2,
    background: tokens.colorPaletteBlueBackground2,
    accent: tokens.colorPaletteBlueBorderActive,
  },
  clientImpact: {
    key: 'clientImpact',
    label: 'Client impact',
    foreground: tokens.colorPaletteRedForeground2,
    background: tokens.colorPaletteRedBackground2,
    accent: tokens.colorPaletteRedBorderActive,
  },
  innovation: {
    key: 'innovation',
    label: 'Innovation',
    foreground: tokens.colorPalettePurpleForeground2,
    background: tokens.colorPalettePurpleBackground2,
    accent: tokens.colorPalettePurpleBorderActive,
  },
  extraMile: {
    key: 'extraMile',
    label: 'Going the extra mile',
    foreground: tokens.colorPaletteTealForeground2,
    background: tokens.colorPaletteTealBackground2,
    accent: tokens.colorPaletteTealBorderActive,
  },
};

export const KUDOS_VALUE_ORDER: KudosValueKey[] = [
  'teamwork',
  'clientImpact',
  'innovation',
  'extraMile',
];

/** "2h ago" / "Yesterday" / "4d ago" — British English, sentence case. */
export function relativeDate(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const mins = Math.round((now.getTime() - then.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
