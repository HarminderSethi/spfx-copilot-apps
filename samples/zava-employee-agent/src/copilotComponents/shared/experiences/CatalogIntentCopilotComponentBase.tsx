import * as React from 'react';

import ZavaIntentCopilotComponentBase from '../components/ZavaIntentCopilotComponentBase';
import type { IZavaInlineHost, IZavaResolvedIntent } from '../components/ZavaIntentCopilotComponentBase';
import { ConfiguredFamilyInline } from './ConfiguredFamilyExperience';
import { getFamilyExperience } from './familyExperienceCatalog';

export interface ICatalogResolvedIntent extends IZavaResolvedIntent {
  intentKey: string;
}

abstract class CatalogIntentCopilotComponentBase<TProperties>
  extends ZavaIntentCopilotComponentBase<TProperties, ICatalogResolvedIntent> {
  protected abstract intentKey: string;
  protected abstract normalizeProperties(properties: unknown): Record<string, string | number | boolean | string[]>;

  protected resolveIntent(properties: unknown): ICatalogResolvedIntent {
    const definition = getFamilyExperience(this.intentKey);
    return { intentKey: this.intentKey, family: definition.family, route: definition.route, params: this.normalizeProperties(properties) };
  }

  protected renderInline(intent: ICatalogResolvedIntent, host: IZavaInlineHost): React.ReactElement {
    return <ConfiguredFamilyInline intentKey={intent.intentKey} params={intent.params} currentUser={host.currentUser} onRequestFullscreen={host.onRequestFullscreen} />;
  }
}

export default CatalogIntentCopilotComponentBase;