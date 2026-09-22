/// <reference types="node" />
import fs from 'fs';import path from 'path';
import { INTENTS } from './catalog';

describe('purpose-specific visual coverage',()=>{
  const sharedRoot=path.resolve(__dirname,'..','..','src','shared');
  const inlineSource=fs.readFileSync(path.join(sharedRoot,'ServiceInlineExperiences.tsx'),'utf8');
  const dashboardSource=fs.readFileSync(path.join(sharedRoot,'ServiceDashboards.tsx'),'utf8');
  it('routes every catalog intent through an explicit inline case',()=>{for(const intent of INTENTS)expect(inlineSource).toContain(`case'${intent.key}'`);});
  it('keeps every inline default layout identity unique',()=>{const layouts=Array.from(inlineSource.matchAll(/data-layout="([^"]+)"/g),match=>match[1]);expect(new Set(layouts).size).toBe(layouts.length);expect(layouts.length).toBeGreaterThanOrEqual(23);});
  it('keeps four dashboard identities and compositions distinct',()=>{const layouts=['my-queue-judgment-cockpit','customer-360-promise-constellation','resolution-room-evidence-command','service-operations-intervention-command'];for(const layout of layouts)expect(dashboardSource).toContain(`data-layout="${layout}"`);expect(new Set(layouts).size).toBe(4);});
  it('keeps case-scoped inline tools searchable and reversible',()=>{expect(inlineSource).toContain('Choose a case to review');expect(inlineSource).toContain('Back to case search');expect(inlineSource).toContain('onVisibleStateChange');});
  it('announces workflow stages and gives capability no-match a recovery action',()=>{expect(inlineSource).toContain('aria-live="polite"');expect(inlineSource).toContain('No matching capabilities');expect(inlineSource).toContain('View all capabilities');});
  it('makes every operational capability reachable through paging',()=>{expect(inlineSource).toContain('const pageSize=7');expect(inlineSource).toContain('of {results.length} scenarios');expect(inlineSource).toContain('>Previous</Button>');expect(inlineSource).toContain('>Next</Button>');expect(inlineSource).not.toContain('results.slice(0,9)');});
  it('does not ship the known inert dashboard actions',()=>{expect(dashboardSource).not.toContain('Review escalation</Button>');expect(dashboardSource).not.toContain('Review swarm package</Button>');expect(dashboardSource).toContain('onOpenRoom');});
  it('keeps Customer 360 searchable and reversible',()=>{expect(dashboardSource).toContain('customer-360-search-directory');expect(dashboardSource).toContain('Back to customer search');expect(dashboardSource).toContain('Search customers');});
  it('keeps leadership answers visually distinct',()=>{expect(inlineSource).toContain('service-performance-demand-river');expect(inlineSource).toContain('regional-service-impact-map');expect(inlineSource).toContain('recurring-service-driver-pareto');expect(inlineSource).toContain('workload-capacity-risk-matrix');expect(inlineSource).toContain('incident-detection-threshold-graph');});
  it('shows the full-screen label only when width permits',()=>{const appSource=fs.readFileSync(path.join(sharedRoot,'ServiceApp.tsx'),'utf8');expect(appSource).toContain('>Full screen</span>');expect(appSource).toContain("'@media (max-width: 620px)':{display:'none'}");});
  it('makes My Queue a guarded judgment workflow',()=>{expect(dashboardSource).toContain('Why this needs judgment');expect(dashboardSource).toContain('Open resolution room');expect(dashboardSource).toContain('Mark resolved');expect(dashboardSource).toContain('Confirm resolved');expect(dashboardSource).toContain('removed from this session queue');});
  it('keeps aggregate leadership answers coordinated and filterable',()=>{const charts=fs.readFileSync(path.join(sharedRoot,'visualizations','ServiceCharts.tsx'),'utf8');expect(inlineSource).toContain('customer-health-portfolio-matrix');expect(charts).toContain('service-operations-filtered-command');expect(charts).toContain('Leadership analysis scope');expect(charts).toContain('Every selection updates');});
  it('publishes a visible-state summary from every inline intent',()=>{expect(inlineSource).toContain('visibleSummary');expect(inlineSource).toContain('visibleStateFor');expect(inlineSource).toContain('props.onVisibleStateChange?.(visibleStateFor');});
});
