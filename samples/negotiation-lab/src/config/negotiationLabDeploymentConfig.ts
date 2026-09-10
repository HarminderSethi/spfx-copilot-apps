export interface INegotiationLabDeploymentConfig {
  targetSiteUrl: string;
}

interface IUnvalidatedDeploymentConfig {
  targetSiteUrl?: unknown;
}

export function validateNegotiationLabDeploymentConfig(
  value: unknown
): INegotiationLabDeploymentConfig {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Negotiation Lab deployment configuration must be an object.');
  }

  const unexpectedKeys = Object.keys(value).filter(
    (key) => key !== '$schema' && key !== 'targetSiteUrl'
  );
  if (unexpectedKeys.length > 0) {
    throw new Error(
      `Negotiation Lab deployment configuration contains unsupported setting(s): ${unexpectedKeys.join(', ')}.`
    );
  }

  const source = value as IUnvalidatedDeploymentConfig;
  if (typeof source.targetSiteUrl !== 'string' || !source.targetSiteUrl.trim()) {
    throw new Error('Negotiation Lab targetSiteUrl must be a non-empty string.');
  }

  const candidate = source.targetSiteUrl.trim();
  if (candidate.startsWith('//')) {
    throw new Error('Negotiation Lab targetSiteUrl cannot be protocol-relative.');
  }

  const serverRelative = candidate.startsWith('/');
  let parsed: URL;
  try {
    parsed = serverRelative
      ? new URL(candidate, 'https://negotiation-lab.invalid/')
      : new URL(candidate);
  } catch {
    throw new Error('Negotiation Lab targetSiteUrl is not a valid URL or path.');
  }

  if (!serverRelative && parsed.protocol !== 'https:') {
    throw new Error('Negotiation Lab targetSiteUrl must use HTTPS.');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(
      'Negotiation Lab targetSiteUrl cannot contain credentials, a query string or a fragment.'
    );
  }
  if (!parsed.pathname || parsed.pathname === '/') {
    throw new Error('Negotiation Lab targetSiteUrl must identify a dedicated site path.');
  }

  return { targetSiteUrl: candidate.replace(/\/$/, '') };
}

// A literal require lets the SPFx bundle embed the administrator-edited root
// configuration while keeping tenant deployment settings outside src/.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const configuredDeployment: unknown = require('../../config/negotiation-lab.deployment.json');

export const negotiationLabDeploymentConfig: INegotiationLabDeploymentConfig =
  validateNegotiationLabDeploymentConfig(configuredDeployment);
