import { INTENTS } from './catalog';
import { IDEAS, PEOPLE, REGION_DATA, STAGE_COUNTS, TRENDS } from './domain';

describe('innovation catalog and domain',()=>{
  it('owns 17 unique routed business scenarios',()=>{
    expect(INTENTS).toHaveLength(17);
    expect(new Set(INTENTS.map(i=>i.key)).size).toBe(17);
    expect(new Set(INTENTS.map(i=>i.route)).size).toBe(17);
    expect(INTENTS.every(i=>i.role&&i.trigger&&i.decisionQuestion&&i.outcome&&i.positivePrompts.length>=2&&i.excludes.startsWith('Do not use'))).toBe(true);
  });
  it('covers five operational profiles and isolated education',()=>{
    expect(new Set(INTENTS.map(i=>i.lens))).toEqual(new Set(['my-innovation','programs-pilots','reviews-gates','investment','enterprise-insights','education']));
    expect(INTENTS.filter(i=>i.operation==='education')).toHaveLength(1);
    expect(INTENTS.filter(i=>i.operation!=='education')).toHaveLength(16);
  });
  it('provides a coherent portfolio-sized deterministic domain',()=>{
    expect(IDEAS).toHaveLength(120);expect(PEOPLE).toHaveLength(11);expect(REGION_DATA).toHaveLength(4);
    expect(REGION_DATA.every(region=>region.longitude>=-180&&region.longitude<=180&&region.latitude>=-90&&region.latitude<=90)).toBe(true);
    expect(STAGE_COUNTS[0].count).toBe(120);expect(STAGE_COUNTS[STAGE_COUNTS.length-1].count).toBeLessThan(STAGE_COUNTS[0].count);
    expect(TRENDS).toHaveLength(12);expect(IDEAS[0].title).toBe('Smart Onboarding Journey');
  });
});