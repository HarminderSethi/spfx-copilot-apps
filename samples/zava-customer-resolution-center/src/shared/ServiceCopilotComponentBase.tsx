import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BaseCopilotComponent, createCopilotTextContent } from '@microsoft/sp-copilot-component';
import ServiceApp, { type IServiceModelContext } from './ServiceApp';
import ServiceThemeProvider from './ServiceThemeProvider';
import { getIntent, type IServiceProperties, type ServiceIntentKey } from './catalog';

abstract class ServiceCopilotComponentBase<TProperties extends IServiceProperties> extends BaseCopilotComponent<TProperties> {
  protected abstract intentKey: ServiceIntentKey;
  private _root: Root | undefined;
  private _resizeObserver: ResizeObserver | undefined;
  private _observedElement: Element | undefined;
  private _resizeFrame: number | undefined;
  private _lastRequestedSize = '';

  protected render(): void {
    const definition = getIntent(this.intentKey);
    const availableModes = this.hostContext.availableDisplayModes || [];
    const canExpand = this.hostContext.displayMode !== 'fullscreen' && availableModes.indexOf('fullscreen') >= 0;
    const currentUserName = this.context.pageContext.user.displayName || definition.role;
    const element = <ServiceThemeProvider theme={this.hostContext.theme} targetDocument={this.context.domElement.ownerDocument}>
      <ServiceApp definition={definition} properties={this.properties} currentUserName={currentUserName}
        displayMode={this.hostContext.displayMode} onRequestFullscreen={canExpand ? this._requestFullscreen : undefined}
        onUpdateModelContext={this._updateModelContext} onSendFollowUp={this._sendFollowUp}/>
    </ServiceThemeProvider>;
    if (!this._root) this._root = createRoot(this.context.domElement);
    this._root.render(element);
    this._observeInlineSize();
  }
  protected async onTeardown(reason?: string): Promise<void> { const view=this.context.domElement.ownerDocument.defaultView;this._resizeObserver?.disconnect();this._resizeObserver=undefined;this._observedElement=undefined;if(this._resizeFrame!==undefined)view?.cancelAnimationFrame(this._resizeFrame);this._resizeFrame=undefined;this._root?.unmount();this._root=undefined;await super.onTeardown(reason); }
  private _requestFullscreen = async (): Promise<void> => { await this.requestDisplayModeAsync('fullscreen'); };
  private _observeInlineSize = (): void => {
    const view=this.context.domElement.ownerDocument.defaultView;
    if(!view||this.hostContext.displayMode==='fullscreen'||!view.ResizeObserver)return;
    view.requestAnimationFrame(()=>{const target=this.context.domElement.firstElementChild||this.context.domElement;if(this._observedElement!==target){this._resizeObserver?.disconnect();this._resizeObserver=new view.ResizeObserver(this._scheduleSizeRequest);this._resizeObserver.observe(target);this._observedElement=target;}this._scheduleSizeRequest();});
  };
  private _scheduleSizeRequest = (): void => {
    const view=this.context.domElement.ownerDocument.defaultView;
    if(!view||this.hostContext.displayMode==='fullscreen')return;
    if(this._resizeFrame!==undefined)view.cancelAnimationFrame(this._resizeFrame);
    this._resizeFrame=view.requestAnimationFrame(()=>{this._resizeFrame=undefined;this._requestCurrentSize().catch(()=>undefined);});
  };
  private _requestCurrentSize = async (): Promise<void> => {
    const target=(this.context.domElement.firstElementChild||this.context.domElement) as HTMLElement;
    const dimensions=this.hostContext.containerDimensions;
    const bounds=target.getBoundingClientRect();
    const measuredWidth=Math.ceil(Math.max(bounds.width,target.scrollWidth));
    const measuredHeight=Math.ceil(Math.max(bounds.height,target.scrollHeight));
    const width=Math.max(1,Math.round(dimensions?.width||Math.min(measuredWidth,dimensions?.maxWidth||measuredWidth)));
    const height=Math.max(1,Math.round(dimensions?.height||Math.min(measuredHeight,dimensions?.maxHeight||measuredHeight)));
    const signature=`${width}x${height}`;
    if(signature===this._lastRequestedSize)return;
    this._lastRequestedSize=signature;
    await this.requestSizeChangeAsync(width,height);
  };
  private _updateModelContext = async (snapshot: IServiceModelContext): Promise<void> => {
    await this.context.copilotBridge.updateModelContextAsync({ content:[createCopilotTextContent(snapshot.summary)], structuredContent:snapshot });
  };
  private _sendFollowUp = async (message: string): Promise<boolean> => {
    const result = await this.context.copilotBridge.sendFollowUpMessageAsync([createCopilotTextContent(message)]);
    return !result.isError;
  };
}
export default ServiceCopilotComponentBase;
