import { escapeHtml } from './escapeHtml';

export interface IFallbackMarkupStrings {
  FallbackHeading: string;
  FallbackServiceLabel: string;
  FallbackDescription: string;
}

/**
 * Last-resort markup written with `innerHTML` when React fails to mount, so the
 * Copilot host never shows a blank card. Every interpolated value is escaped.
 */
export function buildFallbackMarkup(serviceName: string, details: string, strings: IFallbackMarkupStrings): string {
  const safeServiceName = escapeHtml(serviceName || 'all');
  const safeDetails = escapeHtml(details || strings.FallbackDescription);

  return `
    <div role="alert" style="padding:16px;font-family:'Segoe UI',system-ui,sans-serif;color:#242424;border:1px solid #e0e0e0;border-radius:8px;background:#ffffff;">
      <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;">${escapeHtml(strings.FallbackHeading)}</h3>
      <p style="margin:0 0 8px;color:#616161;font-size:13px;">${escapeHtml(strings.FallbackServiceLabel)}: <strong>${safeServiceName}</strong></p>
      <p style="margin:0 0 12px;font-size:13px;">${escapeHtml(strings.FallbackDescription)}</p>
      <div style="padding:8px 10px;border-radius:6px;background:#f5f5f5;color:#424242;font-size:12px;">${safeDetails}</div>
    </div>
  `;
}
