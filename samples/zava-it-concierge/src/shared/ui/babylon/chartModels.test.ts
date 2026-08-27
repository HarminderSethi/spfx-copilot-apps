import { INTENT_CATALOG } from '../../intents/intentCatalog';
import { buildChartModel } from './chartModels';

describe('Babylon analytical models', () => {
  it('builds stable non-empty marks for every inline intent', () => {
    const models = INTENT_CATALOG.map(buildChartModel);

    expect(models).toHaveLength(31);
    expect(models.every((model) => model.marks.length > 0)).toBe(true);
    expect(models.every((model) => new Set(model.marks.map((mark) => mark.id)).size === model.marks.length)).toBe(true);
    expect(new Set(models.map((model) => model.marks.map((mark) => `${mark.label}:${mark.value}`).join('|'))).size).toBe(31);
    expect(models.every((model) => model.marks.every((mark) => ['Current', 'Evidence', 'Policy', 'Cost', 'Risk', 'Outcome'].indexOf(mark.label) < 0))).toBe(true);
  });

  it('uses domain labels for shared scene families', () => {
    const model = (name: string): ReturnType<typeof buildChartModel> => buildChartModel(INTENT_CATALOG.find((intent) => intent.name === name)!);

    expect(model('GetTeamBudget').marks.map((mark) => mark.label)).toEqual(['Spent', 'Committed', 'Pending', 'Available']);
    expect(model('GetLicenseReclaim').marks.map((mark) => mark.label)).toEqual(['Active licenses', 'Low use', 'Safeguarded', 'Reclaimable']);
    expect(model('TrackDeviceShipment').marks.map((mark) => mark.label)).toContain('Carrier transit');
    expect(model('ReportItIssue').marks.map((mark) => mark.label)).toContain('Diagnostic signals');
    expect(model('GetTeamTicketTrend').valueFormat).toBe('count');
    expect(model('GetTicketDeflectionTrend').valueFormat).toBe('percent');
    expect(model('GetItSpendBridge').valueFormat).toBe('currency');
  });

  it('reserves the signature scene types for their named experiences', () => {
    const fleetModel = buildChartModel(INTENT_CATALOG.find((intent) => intent.name === 'GetFleetHealth')!);
    expect(fleetModel.kind).toBe('landscape');
    expect(fleetModel.marks.every((mark) => Number.isFinite(mark.longitude) && Number.isFinite(mark.latitude) && mark.riskCount !== undefined)).toBe(true);
    expect(new Set(fleetModel.marks.map((mark) => `${mark.longitude}:${mark.latitude}`)).size).toBe(4);
    expect(buildChartModel(INTENT_CATALOG.find((intent) => intent.name === 'CorrelateMajorIncident')!).kind).toBe('network');
    expect(buildChartModel(INTENT_CATALOG.find((intent) => intent.name === 'PlanRefreshWaves')!).kind).toBe('horizon');
  });

  it('uses all ten analytical model families across Babylon and D3 renderers', () => {
    expect(new Set(INTENT_CATALOG.map((intent) => buildChartModel(intent).kind)).size).toBe(10);
  });
});