import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ServiceApp from '../../src/shared/ServiceApp';
import ServiceThemeProvider from '../../src/shared/ServiceThemeProvider';
import { getIntent, type ServiceIntentKey } from '../../src/shared/catalog';

const params=new URLSearchParams(location.search);
const intent=(params.get('intent')||'BuildResolutionPlan') as ServiceIntentKey;
const mode=params.get('mode')==='fullscreen'?'fullscreen':'inline';
const theme=params.get('theme')==='dark'?'dark':'light';
const entry=params.get('entry');
const requestedCase=params.get('case');
const caseId=requestedCase==='list'?undefined:requestedCase||(entry==='list'?undefined:entry==='unknown'?'ZCR-9999':'ZCR-1048');
const customer=params.get('customer');
const customerId=mode==='inline'&&intent==='ExploreCustomerHealth'?undefined:customer==='list'?undefined:customer||'alpine-house';
const definition=getIntent(intent);
document.documentElement.style.background=theme==='dark'?'#10191b':'#f4f7f6';
createRoot(document.getElementById('root')!).render(<ServiceThemeProvider theme={theme} targetDocument={document}><ServiceApp definition={definition} properties={{caseId,customerId}} currentUserName={definition.role} displayMode={mode} onRequestFullscreen={()=>undefined}/></ServiceThemeProvider>);
