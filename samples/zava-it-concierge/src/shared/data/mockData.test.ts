import { buildAgeCohorts, buildFleetCells, buildIncidentNodes, buildSpendBridge, buildTicketTrend, buildTopIssues } from './analytics';
import { createMockGraph, DEPARTMENTS, REGIONS } from './mockData';

describe('Zava mock graph', () => {
  it('generates the frozen showcase scale deterministically', () => {
    const first = createMockGraph(42, '2026-08-22T09:00:00.000Z');
    const second = createMockGraph(42, '2026-08-22T09:00:00.000Z');

    expect(first).toEqual(second);
    expect(first.employees).toHaveLength(150);
    expect(first.devices).toHaveLength(180);
    expect(first.surfaceCatalog).toHaveLength(10);
    expect(first.tickets).toHaveLength(300);
    expect(first.budgets).toHaveLength(DEPARTMENTS.length * 4);
  });

  it('keeps all cross-graph references valid', () => {
    const graph = createMockGraph();
    const employeeIds = new Set(graph.employees.map((employee) => employee.id));
    const deviceIds = new Set(graph.devices.map((device) => device.id));
    const skuIds = new Set(graph.surfaceCatalog.map((sku) => sku.id));
    const requestIds = new Set(graph.requests.map((request) => request.id));

    expect(graph.devices.every((device) => employeeIds.has(device.ownerId) && skuIds.has(device.skuId))).toBe(true);
    expect(graph.tickets.every((ticket) => employeeIds.has(ticket.requesterId) && employeeIds.has(ticket.assigneeId) && deviceIds.has(ticket.deviceId))).toBe(true);
    expect(graph.requests.every((request) => employeeIds.has(request.requesterId) && employeeIds.has(request.approverId) && skuIds.has(request.skuId))).toBe(true);
    expect(graph.shipments.every((shipment) => requestIds.has(shipment.requestId))).toBe(true);
  });

  it('builds complete analytical models with stable IDs', () => {
    const graph = createMockGraph();

    expect(buildFleetCells(graph)).toHaveLength(REGIONS.length * DEPARTMENTS.length);
    expect(buildAgeCohorts(graph).reduce((sum, cohort) => sum + cohort.value, 0)).toBe(graph.devices.length);
    expect(buildTicketTrend(graph)).toHaveLength(6);
    const topIssues = buildTopIssues(graph);
    expect(topIssues.slice(0, 6).map((issue) => issue.value)).toEqual([55, 51, 47, 43, 40, 37]);
    expect(topIssues[topIssues.length - 1].secondaryValue).toBe(100);
    expect(buildSpendBridge(graph)).toHaveLength(5);
    expect(buildIncidentNodes(graph).length).toBeGreaterThan(10);
  });
});