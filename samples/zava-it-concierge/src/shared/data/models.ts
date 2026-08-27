export type Lens = 'me' | 'team' | 'company';
export type HealthStatus = 'healthy' | 'attention' | 'critical';
export type RequestStatus = 'draft' | 'pending' | 'approved' | 'fulfilled';

export interface IPersona {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly lens: Lens;
  readonly avatarKey: 'megan' | 'diego' | 'lee';
}

export interface IEmployee {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string;
  readonly region: string;
  readonly role: string;
  readonly managerId?: string;
}

export interface ISurfaceSku {
  readonly id: string;
  readonly name: string;
  readonly category: 'device' | 'accessory';
  readonly memoryGb?: number;
  readonly storageGb?: number;
  readonly price: number;
  readonly stock: number;
  readonly leadTimeDays: number;
  readonly fit: string;
}

export interface IDevice {
  readonly id: string;
  readonly ownerId: string;
  readonly skuId: string;
  readonly department: string;
  readonly region: string;
  readonly ageMonths: number;
  readonly batteryScore: number;
  readonly storageScore: number;
  readonly performanceScore: number;
  readonly patchScore: number;
  readonly warrantyEndIso: string;
  readonly status: HealthStatus;
  readonly compliant: boolean;
}

export interface ITicket {
  readonly id: string;
  readonly requesterId: string;
  readonly assigneeId: string;
  readonly deviceId: string;
  readonly category: string;
  readonly region: string;
  readonly openedDayOffset: number;
  readonly status: 'open' | 'resolved';
  readonly deflected: boolean;
  readonly summary: string;
}

export interface IDeviceRequest {
  readonly id: string;
  readonly requesterId: string;
  readonly approverId: string;
  readonly skuId: string;
  readonly status: RequestStatus;
  readonly stage: string;
  readonly createdDayOffset: number;
  readonly cost: number;
  readonly justification: string;
}

export interface IBudget {
  readonly id: string;
  readonly department: string;
  readonly quarter: string;
  readonly allocated: number;
  readonly spent: number;
  readonly committed: number;
}

export interface IServiceHealth {
  readonly id: string;
  readonly name: string;
  readonly status: HealthStatus;
  readonly incidentCount: number;
  readonly ownerId: string;
  readonly regions: readonly string[];
}

export interface IMajorIncident {
  readonly id: string;
  readonly title: string;
  readonly serviceId: string;
  readonly ownerId: string;
  readonly status: 'investigating' | 'mitigated';
  readonly affectedRegions: readonly string[];
  readonly signalCount: number;
  readonly ticketIds: readonly string[];
}

export interface IShipment {
  readonly id: string;
  readonly requestId: string;
  readonly carrier: string;
  readonly stage: string;
  readonly etaDayOffset: number;
}

export interface IKnowledgeArticle {
  readonly id: string;
  readonly title: string;
  readonly product: string;
  readonly category: string;
  readonly confidence: number;
  readonly minutes: number;
}

export interface ILicenseCohort {
  readonly product: string;
  readonly assigned: number;
  readonly active: number;
  readonly reclaimable: number;
  readonly annualValue: number;
}

export interface IRefreshWave {
  readonly id: string;
  readonly quarter: string;
  readonly region: string;
  readonly devices: number;
  readonly capacity: number;
  readonly cost: number;
}

export interface IItConciergeGraph {
  readonly referenceDateIso: string;
  readonly personas: readonly IPersona[];
  readonly employees: readonly IEmployee[];
  readonly surfaceCatalog: readonly ISurfaceSku[];
  readonly devices: readonly IDevice[];
  readonly tickets: readonly ITicket[];
  readonly requests: readonly IDeviceRequest[];
  readonly budgets: readonly IBudget[];
  readonly services: readonly IServiceHealth[];
  readonly incidents: readonly IMajorIncident[];
  readonly shipments: readonly IShipment[];
  readonly knowledge: readonly IKnowledgeArticle[];
  readonly licenses: readonly ILicenseCohort[];
  readonly refreshWaves: readonly IRefreshWave[];
}

export interface IFleetCell {
  readonly id: string;
  readonly region: string;
  readonly department: string;
  readonly health: number;
  readonly devices: number;
  readonly critical: number;
}

export interface IMetricPoint {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
}

export interface IIncidentNode {
  readonly id: string;
  readonly label: string;
  readonly group: 'incident' | 'service' | 'region' | 'signal';
  readonly severity: number;
  readonly parentId?: string;
}