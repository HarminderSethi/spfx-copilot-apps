import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  normalizeRepositoryUrl,
  renderReadme,
  resolveThumbnailPath,
  selectPrimaryImage,
} from '../../scripts/gallery-model.mjs';

describe('gallery metadata', () => {
  it('selects the first ordered image without requiring preview.png', () => {
    const selected = selectPrimaryImage([
      { type: 'video', order: 1, url: 'https://example.com/demo' },
      { type: 'image', order: 200, name: 'second.png' },
      { type: 'image', order: 100, name: 'introduction.png' },
    ]);

    expect(selected.name).toBe('introduction.png');
  });

  it('resolves encoded image URLs to the owning sample assets', () => {
    const resolved = resolveThumbnailPath('D:\\repo', 'time-off-absence', {
      url: 'https://github.com/pnp/spfx-copilot-apps/raw/main/samples/time-off-absence/assets/my%20time%20off.png',
    });

    expect(resolved).toBe(path.resolve('D:\\repo', 'samples', 'time-off-absence', 'assets', 'my time off.png'));
  });

  it('normalizes stale repository links for generated output', () => {
    expect(normalizeRepositoryUrl('https://github.com/pnp/spfx-copilot-apps/issues'))
      .toBe('https://github.com/pnp/spfx-copilot-components/issues');
  });

  it('sanitizes README HTML and secures external links', () => {
    const html = renderReadme('demo', '# Demo\n\n[Docs](https://example.com)\n\n<script>alert(1)</script>');

    expect(html).not.toContain('<script>');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});