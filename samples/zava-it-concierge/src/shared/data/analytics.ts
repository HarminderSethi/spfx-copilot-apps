import type { IDevice, IFleetCell, IIncidentNode, IItConciergeGraph, IMetricPoint } from './models';
import { DEPARTMENTS, REGIONS, TICKET_CATEGORIES } from './mockData';

export function getDeviceHealth(device: IDevice): number {
  return Math.round((device.batteryScore + device.storageScore + device.performanceScore + device.patchScore) / 4);
}

export function buildFleetCells(graph: IItConciergeGraph): readonly IFleetCell[] {
  const cells: IFleetCell[] = [];
  REGIONS.forEach((region) => {
    DEPARTMENTS.forEach((department) => {
      const devices = graph.devices.filter((device) => device.region === region && device.department === department);
      const totalHealth = devices.reduce((sum, device) => sum + getDeviceHealth(device), 0);
      cells.push({
        id: `${region}-${department}`.toLowerCase().replace(/\s/g, '-'),
        region,
        department,
        health: devices.length === 0 ? 0 : Math.round(totalHealth / devices.length),
        devices: devices.length,
        critical: devices.filter((device) => device.status === 'critical').length
      });
    });
  });
  return cells;
}

export function buildAgeCohorts(graph: IItConciergeGraph): readonly IMetricPoint[] {
  const ranges = [
    { id: '0-1', label: '0-1 year', minimum: 0, maximum: 11 },
    { id: '1-2', label: '1-2 years', minimum: 12, maximum: 23 },
    { id: '2-3', label: '2-3 years', minimum: 24, maximum: 35 },
    { id: '3-4', label: '3-4 years', minimum: 36, maximum: 47 },
    { id: '4-5', label: '4-5 years', minimum: 48, maximum: 59 },
    { id: '5-plus', label: '5+ years', minimum: 60, maximum: Number.POSITIVE_INFINITY }
  ];
  return ranges.map((range) => ({
    id: range.id,
    label: range.label,
    value: graph.devices.filter((device) => device.ageMonths >= range.minimum && device.ageMonths <= range.maximum).length
  }));
}

export function buildTicketTrend(graph: IItConciergeGraph): readonly IMetricPoint[] {
  return Array.from({ length: 6 }, (_, monthIndex) => {
    const minimumOffset = -(monthIndex + 1) * 30;
    const maximumOffset = -monthIndex * 30;
    const tickets = graph.tickets.filter((ticket) => ticket.openedDayOffset >= minimumOffset && ticket.openedDayOffset < maximumOffset);
    return {
      id: `month-${5 - monthIndex}`,
      label: `${6 - monthIndex} mo`,
      value: tickets.length,
      secondaryValue: Math.round((tickets.filter((ticket) => ticket.deflected).length / Math.max(tickets.length, 1)) * 100)
    };
  }).reverse();
}

export function buildTopIssues(graph: IItConciergeGraph): readonly IMetricPoint[] {
  const counts = TICKET_CATEGORIES.map((category) => ({
    id: category.toLowerCase().replace(/\s/g, '-'),
    label: category,
    value: graph.tickets.filter((ticket) => ticket.category === category).length
  })).sort((left, right) => right.value - left.value);
  const total = counts.reduce((sum, issue) => sum + issue.value, 0);
  let cumulative = 0;
  return counts.map((issue) => {
    cumulative += issue.value;
    return { ...issue, secondaryValue: Math.round((cumulative / total) * 100) };
  });
}

export function buildSpendBridge(graph: IItConciergeGraph): readonly IMetricPoint[] {
  const budgets = graph.budgets.filter((budget) => budget.quarter === 'FY26 Q3');
  const allocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const spent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const committed = budgets.reduce((sum, budget) => sum + budget.committed, 0);
  const forecast = Math.round(allocated * 0.08);
  return [
    { id: 'budget', label: 'Budget', value: allocated },
    { id: 'spent', label: 'Spent', value: -spent },
    { id: 'committed', label: 'Committed', value: -committed },
    { id: 'forecast', label: 'Forecast', value: -forecast },
    { id: 'remaining', label: 'Remaining', value: allocated - spent - committed - forecast }
  ];
}

export function buildIncidentNodes(graph: IItConciergeGraph): readonly IIncidentNode[] {
  const incident = graph.incidents[0];
  const service = graph.services.find((candidate) => candidate.id === incident.serviceId);
  const nodes: IIncidentNode[] = [
    { id: incident.id, label: incident.title, group: 'incident', severity: 100 },
    { id: `service-${incident.serviceId}`, label: service?.name ?? incident.serviceId, group: 'service', severity: 82, parentId: incident.id }
  ];
  incident.affectedRegions.forEach((region, index) => nodes.push({ id: `region-${index}`, label: region, group: 'region', severity: 65, parentId: incident.id }));
  for (let index = 0; index < 8; index += 1) {
    nodes.push({ id: `signal-${index}`, label: `Signal ${index + 1}`, group: 'signal', severity: 34 + index * 4, parentId: index % 2 === 0 ? `service-${incident.serviceId}` : `region-${index % 2}` });
  }
  return nodes;
}