import type {
  IBudget,
  IDevice,
  IDeviceRequest,
  IEmployee,
  IItConciergeGraph,
  IKnowledgeArticle,
  ILicenseCohort,
  IMajorIncident,
  IPersona,
  IRefreshWave,
  IServiceHealth,
  IShipment,
  ISurfaceSku,
  ITicket
} from './models';

export const DEMO_REFERENCE_DATE_ISO = '2026-08-22T09:00:00.000Z';
export const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America'] as const;
export const DEPARTMENTS = ['Product', 'Sales', 'Finance', 'Operations', 'Engineering', 'Marketing'] as const;
export const TICKET_CATEGORIES = ['Software access', 'VPN', 'Email', 'Hardware', 'Performance', 'Password', 'Wi-Fi', 'Printing'] as const;
const TICKET_CATEGORY_COUNTS = [55, 51, 47, 43, 40, 37, 14, 13] as const;

function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function select<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)];
}

function dateFromOffset(referenceDateIso: string, dayOffset: number): string {
  const date = new Date(referenceDateIso);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toISOString();
}

function padNumber(value: number, length: number): string {
  const text = String(value);
  return `${'0000000000'.slice(0, Math.max(0, length - text.length))}${text}`;
}

const EMPLOYEE_IDENTITY_OVERRIDES: Readonly<Record<string, { readonly name: string; readonly email: string; readonly role: string }>> = {
  'employee-017': { name: 'Johanna Lorenz', email: 'johanna.lorenz@zava.example.com', role: 'Principal Accessibility Lead' },
  'employee-019': { name: 'Nestor Wilke', email: 'nestor.wilke@zava.example.com', role: 'Assistive Technology Specialist' },
  'employee-024': { name: 'Patti Fernandez', email: 'patti.fernandez@zava.example.com', role: 'HR Business Partner' },
  'employee-025': { name: 'Pradeep Gupta', email: 'pradeep.gupta@zava.example.com', role: 'Inclusive Design Director' },
  'employee-131': { name: 'Alex Poland', email: 'alex.poland@zava.example.com', role: 'Specialist' }
};

function createPersonas(): readonly IPersona[] {
  return [
    { id: 'megan', name: 'Megan Bowen', email: 'megan.bowen@zava.example.com', role: 'Product Manager', lens: 'me', avatarKey: 'megan' },
    { id: 'diego', name: 'Diego Siciliani', email: 'diego.siciliani@zava.example.com', role: 'Director of Product', lens: 'team', avatarKey: 'diego' },
    { id: 'lee', name: 'Lee Gu', email: 'lee.gu@zava.example.com', role: 'IT Operations Lead', lens: 'company', avatarKey: 'lee' }
  ];
}

function createEmployees(random: () => number): readonly IEmployee[] {
  const firstNames = ['Adele', 'Alex', 'Allan', 'Cameron', 'Carole', 'Debra', 'Dylan', 'Elvia', 'Grady', 'Isaiah', 'Johanna', 'Joni', 'Lidia'];
  const lastNames = ['Vance', 'Wilber', 'Munger', 'White', 'Poland', 'Berger', 'Miller', 'Carson', 'Archie', 'Langer', 'Lorenz', 'Sherman'];
  const generated: IEmployee[] = [];

  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      if (generated.length >= 147) {
        break;
      }
      const department = select(DEPARTMENTS, random);
      const region = select(REGIONS, random);
      const id = `employee-${padNumber(generated.length + 1, 3)}`;
      const identity = EMPLOYEE_IDENTITY_OVERRIDES[id];
      generated.push({
        id,
        name: identity?.name ?? `${firstName} ${lastName}`,
        email: identity?.email ?? `${firstName}.${lastName}@zava.example.com`.toLowerCase(),
        department,
        region,
        role: identity?.role ?? (generated.length % 11 === 0 ? 'Team Manager' : 'Specialist'),
        managerId: department === 'Product' ? 'diego' : 'employee-001'
      });
    }
  }

  return [
    { id: 'megan', name: 'Megan Bowen', email: 'megan.bowen@zava.example.com', department: 'Product', region: 'North America', role: 'Product Manager', managerId: 'diego' },
    { id: 'diego', name: 'Diego Siciliani', email: 'diego.siciliani@zava.example.com', department: 'Product', region: 'North America', role: 'Director of Product' },
    { id: 'lee', name: 'Lee Gu', email: 'lee.gu@zava.example.com', department: 'Operations', region: 'Europe', role: 'IT Operations Lead' },
    ...generated
  ];
}

function createSurfaceCatalog(): readonly ISurfaceSku[] {
  return [
    { id: 'surface-laptop-13', name: 'Surface Laptop 13-inch', category: 'device', memoryGb: 16, storageGb: 512, price: 1199, stock: 34, leadTimeDays: 2, fit: 'Mobile productivity' },
    { id: 'surface-laptop-138', name: 'Surface Laptop, Copilot+ PC, 13.8-inch', category: 'device', memoryGb: 32, storageGb: 512, price: 1699, stock: 18, leadTimeDays: 4, fit: 'Hybrid collaboration' },
    { id: 'surface-laptop-15', name: 'Surface Laptop, Copilot+ PC, 15-inch', category: 'device', memoryGb: 32, storageGb: 1024, price: 2099, stock: 11, leadTimeDays: 6, fit: 'Analysis and multitasking' },
    { id: 'surface-pro-12', name: 'Surface Pro 12-inch', category: 'device', memoryGb: 16, storageGb: 512, price: 1099, stock: 27, leadTimeDays: 3, fit: 'Flexible field work' },
    { id: 'surface-pro-13', name: 'Surface Pro, Copilot+ PC, 13-inch', category: 'device', memoryGb: 32, storageGb: 1024, price: 1899, stock: 15, leadTimeDays: 5, fit: 'Premium mobile work' },
    { id: 'surface-laptop-studio-2', name: 'Surface Laptop Studio 2', category: 'device', memoryGb: 32, storageGb: 1024, price: 2399, stock: 8, leadTimeDays: 9, fit: 'Design and engineering' },
    { id: 'surface-go-4', name: 'Surface Go 4', category: 'device', memoryGb: 8, storageGb: 256, price: 799, stock: 42, leadTimeDays: 2, fit: 'Frontline mobility' },
    { id: 'surface-hub-3', name: 'Surface Hub 3 50-inch', category: 'device', memoryGb: 32, storageGb: 512, price: 8999, stock: 4, leadTimeDays: 18, fit: 'Shared collaboration rooms' },
    { id: 'surface-usb4-dock', name: 'Surface USB4 Dock', category: 'accessory', price: 199, stock: 61, leadTimeDays: 2, fit: 'Hybrid desk setup' },
    { id: 'surface-pro-keyboard', name: 'Surface Pro Keyboard', category: 'accessory', price: 179, stock: 49, leadTimeDays: 2, fit: 'Surface Pro productivity' }
  ];
}

function createDevices(employees: readonly IEmployee[], catalog: readonly ISurfaceSku[], random: () => number, referenceDateIso: string): readonly IDevice[] {
  const deviceSkus = catalog.filter((sku) => sku.category === 'device');
  const devices: IDevice[] = [{
    id: 'ZVA-SRF-1042', ownerId: 'megan', skuId: 'surface-laptop-138', department: 'Product', region: 'North America', ageMonths: 42,
    batteryScore: 62, storageScore: 71, performanceScore: 78, patchScore: 92,
    warrantyEndIso: dateFromOffset(referenceDateIso, 74), status: 'attention', compliant: true
  }];

  for (let index = 1; index < 180; index += 1) {
    const employee = employees[index % employees.length];
    const batteryScore = 48 + Math.floor(random() * 52);
    const storageScore = 55 + Math.floor(random() * 45);
    const performanceScore = 52 + Math.floor(random() * 48);
    const patchScore = 68 + Math.floor(random() * 32);
    const lowestScore = Math.min(batteryScore, storageScore, performanceScore, patchScore);
    devices.push({
      id: `ZVA-SRF-${padNumber(1042 + index, 4)}`,
      ownerId: employee.id,
      skuId: select(deviceSkus, random).id,
      department: employee.department,
      region: employee.region,
      ageMonths: 3 + Math.floor(random() * 69),
      batteryScore,
      storageScore,
      performanceScore,
      patchScore,
      warrantyEndIso: dateFromOffset(referenceDateIso, Math.floor(random() * 900) - 240),
      status: lowestScore < 58 ? 'critical' : lowestScore < 72 ? 'attention' : 'healthy',
      compliant: patchScore >= 74
    });
  }

  return devices;
}

function createTickets(employees: readonly IEmployee[], devices: readonly IDevice[], random: () => number): readonly ITicket[] {
  const summaries: Record<string, string> = {
    'Software access': 'Application access request', VPN: 'VPN connection drops', Email: 'Mailbox synchronization delay', Hardware: 'Docking station not detected',
    Performance: 'Device slows during meetings', Password: 'Password reset assistance', 'Wi-Fi': 'Office Wi-Fi disconnects', Printing: 'Secure print queue unavailable'
  };

  const categories: Array<(typeof TICKET_CATEGORIES)[number]> = [];
  TICKET_CATEGORIES.forEach((category, categoryIndex) => {
    for (let count = 0; count < TICKET_CATEGORY_COUNTS[categoryIndex]; count += 1) {
      categories.push(category);
    }
  });

  return categories.map((category, index) => {
    const requester = employees[index % employees.length];
    return {
      id: `TKT-${String(6100 + index)}`,
      requesterId: requester.id,
      assigneeId: index % 7 === 0 ? 'lee' : employees[(index + 17) % employees.length].id,
      deviceId: devices[index % devices.length].id,
      category,
      region: requester.region,
      openedDayOffset: -Math.floor(random() * 190),
      status: index % 5 === 0 ? 'open' : 'resolved',
      deflected: index % 3 !== 0,
      summary: summaries[category]
    };
  });
}

function createRequests(catalog: readonly ISurfaceSku[], employees: readonly IEmployee[]): readonly IDeviceRequest[] {
  const deviceSkus = catalog.filter((sku) => sku.category === 'device');
  const requests: IDeviceRequest[] = [{
    id: 'REQ-2048', requesterId: 'megan', approverId: 'diego', skuId: 'surface-laptop-138', status: 'pending', stage: 'Manager review',
    createdDayOffset: -2, cost: 2068.98, justification: 'A larger memory configuration supports customer workshops and product analysis.'
  }];
  for (let index = 1; index < 24; index += 1) {
    requests.push({
      id: `REQ-${2048 + index}`,
      requesterId: employees[(index * 5) % employees.length].id,
      approverId: index % 4 === 0 ? 'diego' : employees[(index * 5 + 1) % employees.length].id,
      skuId: deviceSkus[index % deviceSkus.length].id,
      status: index % 5 === 0 ? 'fulfilled' : index % 4 === 0 ? 'approved' : 'pending',
      stage: index % 5 === 0 ? 'Complete' : index % 4 === 0 ? 'Procurement' : 'Manager review',
      createdDayOffset: -(index + 2),
      cost: deviceSkus[index % deviceSkus.length].price,
      justification: 'Role-aligned refresh request with current device and workload evidence.'
    });
  }
  return requests;
}

function createBudgets(): readonly IBudget[] {
  const quarters = ['FY26 Q1', 'FY26 Q2', 'FY26 Q3', 'FY26 Q4'];
  const budgets: IBudget[] = [];
  DEPARTMENTS.forEach((department, departmentIndex) => {
    quarters.forEach((quarter, quarterIndex) => {
      const allocated = 92000 + departmentIndex * 14000 + quarterIndex * 3500;
      budgets.push({
        id: `${department.toLowerCase()}-${quarter.toLowerCase().replace(/\s/g, '-')}`,
        department,
        quarter,
        allocated,
        spent: Math.round(allocated * (0.48 + quarterIndex * 0.055)),
        committed: 7400 + departmentIndex * 900 + quarterIndex * 450
      });
    });
  });
  return budgets;
}

function createServices(): readonly IServiceHealth[] {
  return [
    { id: 'teams', name: 'Microsoft Teams', status: 'attention', incidentCount: 1, ownerId: 'lee', regions: ['Europe', 'North America'] },
    { id: 'exchange', name: 'Exchange Online', status: 'healthy', incidentCount: 0, ownerId: 'lee', regions: [] },
    { id: 'sharepoint', name: 'SharePoint Online', status: 'healthy', incidentCount: 0, ownerId: 'lee', regions: [] },
    { id: 'onedrive', name: 'OneDrive for Business', status: 'healthy', incidentCount: 0, ownerId: 'lee', regions: [] },
    { id: 'intune', name: 'Microsoft Intune', status: 'attention', incidentCount: 1, ownerId: 'lee', regions: ['Asia Pacific'] }
  ];
}

function createKnowledge(): readonly IKnowledgeArticle[] {
  return [
    { id: 'KB-104', title: 'Improve Teams call quality on Surface', product: 'Surface Laptop', category: 'Performance', confidence: 96, minutes: 4 },
    { id: 'KB-219', title: 'Update Surface dock firmware', product: 'Surface USB4 Dock', category: 'Hardware', confidence: 88, minutes: 7 },
    { id: 'KB-086', title: 'Optimize battery settings for travel', product: 'Surface', category: 'Battery', confidence: 82, minutes: 5 },
    { id: 'KB-301', title: 'Reconnect to Zava VPN', product: 'Windows 11', category: 'VPN', confidence: 77, minutes: 3 }
  ];
}

function createRefreshWaves(random: () => number): readonly IRefreshWave[] {
  const quarters = ['FY26 Q3', 'FY26 Q4', 'FY27 Q1', 'FY27 Q2'];
  const waves: IRefreshWave[] = [];
  quarters.forEach((quarter, quarterIndex) => {
    REGIONS.forEach((region, regionIndex) => {
      const devices = 28 + Math.floor(random() * 48) + quarterIndex * 6;
      const capacity = 58 + regionIndex * 7;
      waves.push({ id: `wave-${quarterIndex}-${regionIndex}`, quarter, region, devices, capacity, cost: devices * (1420 + regionIndex * 55) });
    });
  });
  return waves;
}

export function createMockGraph(seed = 20260822, referenceDateIso = DEMO_REFERENCE_DATE_ISO): IItConciergeGraph {
  const random = createRandom(seed);
  const personas = createPersonas();
  const employees = createEmployees(random);
  const surfaceCatalog = createSurfaceCatalog();
  const devices = createDevices(employees, surfaceCatalog, random, referenceDateIso);
  const tickets = createTickets(employees, devices, random);
  const requests = createRequests(surfaceCatalog, employees);
  const budgets = createBudgets();
  const services = createServices();
  const incidents: readonly IMajorIncident[] = [{
    id: 'INC-7091', title: 'Intermittent Teams media routing', serviceId: 'teams', ownerId: 'lee', status: 'investigating',
    affectedRegions: ['Europe', 'North America'], signalCount: 18, ticketIds: tickets.filter((ticket) => ticket.category === 'Performance').slice(0, 12).map((ticket) => ticket.id)
  }];
  const shipments: readonly IShipment[] = [
    { id: 'ORD-48291', requestId: 'REQ-2048', carrier: 'Northwind Express', stage: 'In transit', etaDayOffset: 2 }
  ];
  const licenses: readonly ILicenseCohort[] = [
    { product: 'Microsoft 365 E5', assigned: 1240, active: 1168, reclaimable: 42, annualValue: 23940 },
    { product: 'Power BI Pro', assigned: 510, active: 431, reclaimable: 58, annualValue: 8352 },
    { product: 'Visio Plan 2', assigned: 184, active: 137, reclaimable: 31, annualValue: 5642 },
    { product: 'Project Plan 3', assigned: 126, active: 96, reclaimable: 19, annualValue: 6840 }
  ];

  return Object.freeze({
    referenceDateIso,
    personas,
    employees,
    surfaceCatalog,
    devices,
    tickets,
    requests,
    budgets,
    services,
    incidents,
    shipments,
    knowledge: createKnowledge(),
    licenses,
    refreshWaves: createRefreshWaves(random)
  });
}

export const MOCK_GRAPH = createMockGraph();