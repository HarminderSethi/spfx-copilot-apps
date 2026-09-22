export type ServiceRegion = 'AMER' | 'EMEA' | 'APAC' | 'LATAM';
export type EvidenceKind = 'verified' | 'calculation' | 'inference' | 'contrary' | 'gap';
export type CaseStatus = 'new' | 'diagnosing' | 'waiting' | 'resolved';
export interface ICustomerConstellationNode { readonly label:string; readonly kind:'signal'|'commitment'; readonly weight:number; readonly angle:number; }

export interface ICustomerRecord {
  readonly id: string;
  readonly name: string;
  readonly region: ServiceRegion;
  readonly tier: 'Enterprise' | 'Business' | 'Standard';
  readonly language: string;
  readonly health: number;
  readonly renewalRisk: number;
  readonly sites: number;
  readonly annualExposure: number;
  readonly primaryGoal: string;
  readonly relationshipSummary: string;
  readonly constellation: readonly ICustomerConstellationNode[];
}
export interface IServiceCaseRecord {
  readonly id: string;
  readonly customerId: string;
  readonly product: string;
  readonly version: string;
  readonly symptom: string;
  readonly severity: 1 | 2 | 3 | 4;
  readonly status: CaseStatus;
  readonly sentiment: number;
  readonly affectedSites: number;
  readonly openedOffsetMinutes: number;
  readonly owner: string;
  readonly channel: 'Email' | 'Chat' | 'Phone' | 'Portal';
}
export interface IEvidenceRecord {
  readonly id: string;
  readonly caseId: string;
  readonly kind: EvidenceKind;
  readonly label: string;
  readonly source: string;
  readonly freshnessMinutes: number;
  readonly confidence: number;
}
export interface ICommitmentRecord {
  readonly id: string;
  readonly customerId: string;
  readonly label: string;
  readonly owner: string;
  readonly dueOffsetMinutes: number;
  readonly status: 'on-track' | 'at-risk' | 'complete';
  readonly party: 'Zava' | 'Customer';
}
export interface IExpertRecord { readonly id:string; readonly name:string; readonly role:string; readonly skills:readonly string[]; readonly availableInMinutes:number; }
export interface IRegionSignal { readonly id:ServiceRegion; readonly label:string; readonly longitude:number; readonly latitude:number; readonly cases:number; readonly slaRisk:number; readonly recoveryCost:number; readonly csat:number; }
export interface IPriorityResult { readonly caseId:string; readonly score:number; readonly reasons:readonly string[]; readonly remainingMinutes:number; }
export interface IRecoveryScenario { readonly id:string; readonly label:string; readonly amount:number; readonly authority:string; readonly precedent:number; readonly trustOutcome:number; }
export interface IIncidentSignal { readonly caseId:string; readonly similarity:number; readonly related:boolean; readonly longitude:number; readonly latitude:number; }
export interface IServiceAggregate {
  readonly customers:readonly ICustomerRecord[];
  readonly cases:readonly IServiceCaseRecord[];
  readonly evidence:readonly IEvidenceRecord[];
  readonly commitments:readonly ICommitmentRecord[];
  readonly experts:readonly IExpertRecord[];
  readonly regions:readonly IRegionSignal[];
}
export interface ICustomerServiceDataService { getAggregate(): IServiceAggregate; getCase(caseId:string): IServiceCaseRecord | undefined; }

const REGIONS: readonly ServiceRegion[]=['AMER','EMEA','APAC','LATAM'];
const PRODUCTS=['Zava Handheld','Zava Commerce','Zava Pay','Zava Connect','Zava Inventory','Zava Insights'];
const OWNERS=['Amina Yusuf','Diego Siciliani','Pradeep Gupta','Megan Bowen','Nestor Wilke'];
const CUSTOMER_NAMES=['Alpine House','Northwind Traders','Contoso Retail','Fabrikam Stores','Adventure Works','Litware','Tailspin Toys','Blue Yonder'];
const bounded=(value:number,min:number,max:number):number=>Math.max(min,Math.min(max,value));
const customerId=(index:number):string=>`customer-${(`00${index}`).slice(-3)}`;
const caseId=(index:number):string=>`ZCR-${1000+index}`;

const CUSTOMER_PROFILES:Readonly<Record<number,ICustomerRecord>>={
  0:{id:'alpine-house',name:'Alpine House',region:'EMEA',tier:'Enterprise',language:'fr-FR',health:68,renewalRisk:41,sites:42,annualExposure:1800000,primaryGoal:'Launch handheld activation across all stores',relationshipSummary:'Tomorrow\'s launch depends on verified rollback and a credible recovery commitment.',constellation:[{label:'Firmware 8.4.12',kind:'signal',weight:92,angle:205},{label:'Network normal',kind:'signal',weight:78,angle:330},{label:'Rollback verified',kind:'signal',weight:88,angle:145},{label:'Verify 42 stores',kind:'commitment',weight:72,angle:265},{label:'Bilingual update',kind:'commitment',weight:66,angle:45}]},
  1:{id:'northwind-traders',name:'Northwind Traders',region:'AMER',tier:'Enterprise',language:'en-US',health:54,renewalRisk:67,sites:28,annualExposure:2400000,primaryGoal:'Stabilize commerce synchronization before peak season',relationshipSummary:'Repeated delivery-sync incidents are increasing effort for store teams and executive sponsors.',constellation:[{label:'Sync backlog',kind:'signal',weight:96,angle:188},{label:'Retry verified',kind:'signal',weight:71,angle:322},{label:'Peak forecast',kind:'signal',weight:84,angle:155},{label:'Clear order queue',kind:'commitment',weight:90,angle:238},{label:'Executive update',kind:'commitment',weight:58,angle:18}]},
  2:{id:'contoso-retail',name:'Contoso Retail',region:'APAC',tier:'Business',language:'ja-JP',health:82,renewalRisk:18,sites:16,annualExposure:920000,primaryGoal:'Expand contactless payment to the APAC pilot',relationshipSummary:'Adoption is strong, but payment reconciliation evidence must be closed before expansion.',constellation:[{label:'Ledger mismatch',kind:'signal',weight:74,angle:215},{label:'Rates verified',kind:'signal',weight:91,angle:345},{label:'Exports missing',kind:'signal',weight:55,angle:145},{label:'Pilot decision',kind:'commitment',weight:82,angle:278},{label:'Finance sign-off',kind:'commitment',weight:69,angle:34}]},
  3:{id:'fabrikam-stores',name:'Fabrikam Stores',region:'LATAM',tier:'Enterprise',language:'es-MX',health:61,renewalRisk:52,sites:34,annualExposure:1350000,primaryGoal:'Restore inventory accuracy across regional hubs',relationshipSummary:'Inventory drift is affecting availability promises and requires coordinated field verification.',constellation:[{label:'Cycle count drift',kind:'signal',weight:89,angle:172},{label:'Sync delayed',kind:'signal',weight:81,angle:325},{label:'Hub access gap',kind:'signal',weight:62,angle:150},{label:'Verify three hubs',kind:'commitment',weight:86,angle:252},{label:'Availability promise',kind:'commitment',weight:77,angle:22}]}
};
const customers:readonly ICustomerRecord[]=Array.from({length:12},(_,index)=>CUSTOMER_PROFILES[index]||({
  id:index===0?'alpine-house':customerId(index),
  name:index===0?'Alpine House':`${CUSTOMER_NAMES[index%CUSTOMER_NAMES.length]} ${Math.floor(index/CUSTOMER_NAMES.length)+1}`,
  region:REGIONS[index%REGIONS.length], tier:index%5===0?'Enterprise':index%3===0?'Business':'Standard',
  language:index%9===0?'fr-FR':index%7===0?'ja-JP':index%11===0?'ar-SA':'en-US',
  health:bounded(91-(index*7)%48,35,96),renewalRisk:bounded(8+(index*11)%63,5,82),sites:4+(index*5)%38,
  annualExposure:180000+(index*73000)%1700000,primaryGoal:`Improve ${PRODUCTS[index%PRODUCTS.length]} service reliability`,
  relationshipSummary:'Service history, adoption, and open commitments determine the next customer-success action.',
  constellation:[{label:`${PRODUCTS[index%PRODUCTS.length]} health`,kind:'signal',weight:65+(index%25),angle:180+(index%55)},{label:'Adoption trend',kind:'signal',weight:58+(index%32),angle:300+(index%40)},{label:'Case pattern',kind:'signal',weight:52+(index%38),angle:80+(index%45)},{label:'Service follow-up',kind:'commitment',weight:60+(index%30),angle:235+(index%35)},{label:'Customer outcome',kind:'commitment',weight:55+(index%35),angle:15+(index%30)}]
}));
const CASE_PROFILES:Readonly<Record<number,IServiceCaseRecord>>={
  1:{id:'ZCR-1001',customerId:'northwind-traders',product:'Zava Commerce',version:'9.2.6',symptom:'Delivery sync delay',severity:1,status:'diagnosing',sentiment:31,affectedSites:28,openedOffsetMinutes:-42,owner:'Diego Siciliani',channel:'Phone'},
  2:{id:'ZCR-1002',customerId:'contoso-retail',product:'Zava Pay',version:'8.6.4',symptom:'Payment reconciliation mismatch',severity:2,status:'waiting',sentiment:72,affectedSites:9,openedOffsetMinutes:-64,owner:'Megan Bowen',channel:'Portal'},
  3:{id:'ZCR-1003',customerId:'fabrikam-stores',product:'Zava Inventory',version:'7.8.9',symptom:'Inventory availability drift',severity:1,status:'diagnosing',sentiment:38,affectedSites:14,openedOffsetMinutes:-51,owner:'Nestor Wilke',channel:'Chat'},
  48:{id:'ZCR-1048',customerId:'alpine-house',product:'Zava Handheld',version:'8.4.12',symptom:'Activation handshake rejected',severity:1,status:'diagnosing',sentiment:34,affectedSites:42,openedOffsetMinutes:-258,owner:'Amina Yusuf',channel:'Email'}
};
const cases:readonly IServiceCaseRecord[]=Array.from({length:500},(_,index)=>CASE_PROFILES[index]||({
  id:caseId(index),customerId:customers[index%customers.length].id,
  product:index===48?'Zava Handheld':PRODUCTS[index%PRODUCTS.length], version:index===48?'8.4.12':`${7+index%3}.${index%8}.${index%15}`,
  symptom:index===48?'Activation handshake rejected':['Activation failure','Delivery sync delay','Payment mismatch','Access denied','Inventory drift'][index%5],
  severity:(1+(index%4)) as 1|2|3|4, status:index%9===0?'resolved':index%4===0?'waiting':index%3===0?'new':'diagnosing',
  sentiment:bounded(24+(index*13)%70,20,95), affectedSites:index===48?42:1+(index*7)%28,
  openedOffsetMinutes:-(35+(index*43)%25000), owner:OWNERS[index%OWNERS.length], channel:(['Email','Chat','Phone','Portal'] as const)[index%4]
}));
const evidence:readonly IEvidenceRecord[]=[
  {id:'ev-firmware',caseId:'ZCR-1048',kind:'verified',label:'Firmware 8.4.12 rejects the activation handshake',source:'Activation telemetry',freshnessMinutes:8,confidence:96},
  {id:'ev-network',caseId:'ZCR-1048',kind:'contrary',label:'Network health is normal at 39 of 42 stores',source:'Site diagnostics',freshnessMinutes:13,confidence:94},
  {id:'ev-rollback',caseId:'ZCR-1048',kind:'verified',label:'Rollback restored six pilot devices',source:'Specialist test',freshnessMinutes:18,confidence:99},
  {id:'ev-missing',caseId:'ZCR-1048',kind:'gap',label:'Three stores have not uploaded telemetry',source:'Evidence completeness',freshnessMinutes:4,confidence:100},
  {id:'ev-similar',caseId:'ZCR-1048',kind:'inference',label:'Seven cases share version, symptom, and onset',source:'Similarity model',freshnessMinutes:6,confidence:84},
  {id:'ev-northwind-orders',caseId:'ZCR-1001',kind:'verified',label:'Order export lag begins after commerce 9.2.6 deployment',source:'Commerce telemetry',freshnessMinutes:11,confidence:95},
  {id:'ev-northwind-retry',caseId:'ZCR-1001',kind:'verified',label:'Retry queue clears delayed orders without data loss',source:'Reliability replay',freshnessMinutes:19,confidence:91},
  {id:'ev-northwind-volume',caseId:'ZCR-1001',kind:'inference',label:'Peak-season volume will exhaust retry capacity in four hours',source:'Demand forecast',freshnessMinutes:7,confidence:82},
  {id:'ev-contoso-ledger',caseId:'ZCR-1002',kind:'verified',label:'Settlement ledger differs from nine APAC pilot terminals',source:'Payment reconciliation',freshnessMinutes:14,confidence:93},
  {id:'ev-contoso-currency',caseId:'ZCR-1002',kind:'contrary',label:'Currency conversion rates match the approved finance table',source:'Finance controls',freshnessMinutes:23,confidence:97},
  {id:'ev-contoso-export',caseId:'ZCR-1002',kind:'gap',label:'Two terminal exports are still awaiting customer upload',source:'Evidence completeness',freshnessMinutes:5,confidence:100},
  {id:'ev-fabrikam-count',caseId:'ZCR-1003',kind:'verified',label:'Physical counts differ from availability at three regional hubs',source:'Hub cycle count',freshnessMinutes:17,confidence:96},
  {id:'ev-fabrikam-sync',caseId:'ZCR-1003',kind:'inference',label:'Delayed handheld synchronization explains most inventory drift',source:'Inventory correlation',freshnessMinutes:9,confidence:86},
  {id:'ev-fabrikam-access',caseId:'ZCR-1003',kind:'gap',label:'Two hub access windows require customer confirmation',source:'Field readiness',freshnessMinutes:4,confidence:100}
];
const generatedEvidence:readonly IEvidenceRecord[]=cases.filter(record=>!evidence.some(item=>item.caseId===record.id)).flatMap(record=>{
  const age=Math.max(4,Math.min(45,Math.round(Math.abs(record.openedOffsetMinutes)/12)));
  return [
    {id:`${record.id}-signal`,caseId:record.id,kind:'verified' as const,label:`${record.product} ${record.version} records ${record.symptom.toLowerCase()} across ${record.affectedSites} affected sites`,source:`${record.product} telemetry`,freshnessMinutes:age,confidence:92},
    {id:`${record.id}-pattern`,caseId:record.id,kind:'inference' as const,label:`Recent ${record.product} cases show a related ${record.symptom.toLowerCase()} pattern`,source:'Case similarity analysis',freshnessMinutes:Math.max(3,age-2),confidence:76+record.severity*3},
    {id:`${record.id}-gap`,caseId:record.id,kind:'gap' as const,label:`Customer outcome confirmation is still required before ${record.id} can close`,source:'Resolution completeness',freshnessMinutes:4,confidence:100}
  ];
});
const commitments:readonly ICommitmentRecord[]=[
  {id:'com-update',customerId:'alpine-house',label:'Bilingual customer update',owner:'Amina Yusuf',dueOffsetMinutes:45,status:'at-risk',party:'Zava'},
  {id:'com-launch',customerId:'alpine-house',label:'Launch readiness decision',owner:'Megan Bowen',dueOffsetMinutes:180,status:'at-risk',party:'Zava'},
  {id:'com-telemetry',customerId:'alpine-house',label:'Upload diagnostics from three stores',owner:'Luc Dubois',dueOffsetMinutes:70,status:'on-track',party:'Customer'},
  {id:'com-review',customerId:'alpine-house',label:'Executive recovery review',owner:'Diego Siciliani',dueOffsetMinutes:240,status:'on-track',party:'Zava'},
  {id:'com-northwind-sync',customerId:'northwind-traders',label:'Peak-season sync remediation',owner:'Pradeep Gupta',dueOffsetMinutes:95,status:'at-risk',party:'Zava'},
  {id:'com-northwind-data',customerId:'northwind-traders',label:'Provide three failed order samples',owner:'Northwind operations',dueOffsetMinutes:140,status:'on-track',party:'Customer'},
  {id:'com-contoso-pilot',customerId:'contoso-retail',label:'APAC payment pilot decision',owner:'Megan Bowen',dueOffsetMinutes:360,status:'on-track',party:'Zava'},
  {id:'com-contoso-recon',customerId:'contoso-retail',label:'Validate reconciliation export',owner:'Contoso finance',dueOffsetMinutes:220,status:'on-track',party:'Customer'},
  {id:'com-fabrikam-audit',customerId:'fabrikam-stores',label:'Inventory hub verification',owner:'Nestor Wilke',dueOffsetMinutes:75,status:'at-risk',party:'Zava'},
  {id:'com-fabrikam-access',customerId:'fabrikam-stores',label:'Confirm hub access windows',owner:'Fabrikam operations',dueOffsetMinutes:120,status:'at-risk',party:'Customer'}
];
const experts:readonly IExpertRecord[]=[
  {id:'expert-pradeep',name:'Pradeep Gupta',role:'Product specialist',skills:['Firmware','Activation'],availableInMinutes:8},
  {id:'expert-lee',name:'Lee Gu',role:'Reliability engineer',skills:['Telemetry','Incident response'],availableInMinutes:14},
  {id:'expert-nestor',name:'Nestor Wilke',role:'Field coordinator',skills:['Retail sites','Dispatch'],availableInMinutes:32}
];
export const REGION_SIGNALS:readonly IRegionSignal[]=[
  {id:'AMER',label:'Americas',longitude:-100,latitude:39,cases:138,slaRisk:19,recoveryCost:184000,csat:84},
  {id:'EMEA',label:'Europe, Middle East and Africa',longitude:14,latitude:49,cases:164,slaRisk:31,recoveryCost:242000,csat:78},
  {id:'APAC',label:'Asia Pacific',longitude:116,latitude:19,cases:121,slaRisk:38,recoveryCost:169000,csat:75},
  {id:'LATAM',label:'Latin America',longitude:-61,latitude:-15,cases:77,slaRisk:27,recoveryCost:96000,csat:81}
];
const aggregate:IServiceAggregate={customers,cases,evidence:[...evidence,...generatedEvidence],commitments,experts,regions:REGION_SIGNALS};
export class MockCustomerServiceDataService implements ICustomerServiceDataService {
  public getAggregate():IServiceAggregate{return aggregate;}
  public getCase(id:string):IServiceCaseRecord|undefined{return aggregate.cases.find(item=>item.id===id);}
}
export const serviceData=new MockCustomerServiceDataService();

export const getCaseEvidence=(record:IServiceCaseRecord):readonly IEvidenceRecord[]=>{
  const explicit=evidence.filter(item=>item.caseId===record.id);
  if(explicit.length)return explicit;
  const age=Math.max(4,Math.min(45,Math.round(Math.abs(record.openedOffsetMinutes)/12)));
  return [
    {id:`${record.id}-signal`,caseId:record.id,kind:'verified',label:`${record.product} ${record.version} records ${record.symptom.toLowerCase()} across ${record.affectedSites} affected sites`,source:`${record.product} telemetry`,freshnessMinutes:age,confidence:92},
    {id:`${record.id}-pattern`,caseId:record.id,kind:'inference',label:`Recent ${record.product} cases show a related ${record.symptom.toLowerCase()} pattern`,source:'Case similarity analysis',freshnessMinutes:Math.max(3,age-2),confidence:76+record.severity*3},
    {id:`${record.id}-gap`,caseId:record.id,kind:'gap',label:`Customer outcome confirmation is still required before ${record.id} can close`,source:'Resolution completeness',freshnessMinutes:4,confidence:100}
  ];
};

export const calculateSlaRemaining=(record:IServiceCaseRecord):number=>{
  const entitlement=record.customerId==='alpine-house'?360:record.severity===1?240:record.severity===2?480:960;
  return Math.max(0,entitlement-Math.abs(record.openedOffsetMinutes));
};
export const rankPriority=(record:IServiceCaseRecord):IPriorityResult=>{
  const customer=customers.find(item=>item.id===record.customerId);
  const remaining=calculateSlaRemaining(record);
  const reasons:string[]=[];
  let score=(5-record.severity)*14+record.affectedSites*.7+(100-record.sentiment)*.22;
  if(customer?.tier==='Enterprise'){score+=15;reasons.push('Enterprise entitlement');}
  if(remaining<120){score+=22;reasons.push('SLA inside two hours');}
  if(record.affectedSites>20)reasons.push(`${record.affectedSites} affected sites`);
  if(record.sentiment<45)reasons.push('Customer concern rising');
  return {caseId:record.id,score:Math.round(score),reasons,remainingMinutes:remaining};
};
export const topPriorityCases=(limit=6):readonly IPriorityResult[]=>cases.filter(item=>item.status!=='resolved').map(rankPriority).sort((a,b)=>b.score-a.score).slice(0,limit);
export const recoveryScenarios=(amount:number):readonly IRecoveryScenario[]=>{
  if(amount===4500)return [
    {id:'launch-credit',label:'Launch service credit',amount:4500,authority:'Service manager',precedent:45,trustOutcome:74},
    {id:'onsite-cover',label:'On-site launch cover',amount:7200,authority:'VP Customer Operations',precedent:29,trustOutcome:88},
    {id:'support-extension',label:'90-day support extension',amount:2600,authority:'Service manager',precedent:34,trustOutcome:81},
    {id:'executive-sponsor',label:'Executive sponsor plan',amount:1200,authority:'Customer success director',precedent:18,trustOutcome:77}
  ];
  if(amount===6000)return [
    {id:'peak-capacity',label:'Peak capacity upgrade',amount:9800,authority:'VP Customer Operations',precedent:63,trustOutcome:91},
    {id:'sync-credit',label:'Sync disruption credit',amount:6000,authority:'Service director',precedent:71,trustOutcome:76},
    {id:'reliability-sprint',label:'Reliability sprint',amount:7400,authority:'Product VP',precedent:38,trustOutcome:87},
    {id:'renewal-protection',label:'Renewal protection plan',amount:3600,authority:'Customer success director',precedent:44,trustOutcome:83}
  ];
  if(amount===2300)return [
    {id:'pilot-services',label:'Pilot service extension',amount:2300,authority:'Service manager',precedent:22,trustOutcome:82},
    {id:'finance-review',label:'Finance reconciliation review',amount:1400,authority:'Payments director',precedent:16,trustOutcome:79},
    {id:'terminal-cover',label:'Terminal replacement cover',amount:5100,authority:'VP Customer Operations',precedent:48,trustOutcome:88},
    {id:'no-commercial',label:'No commercial remedy',amount:0,authority:'Representative',precedent:3,trustOutcome:64}
  ];
  if(amount===3375)return [
    {id:'hub-audit',label:'Regional hub audit',amount:5200,authority:'Field service director',precedent:36,trustOutcome:86},
    {id:'inventory-credit',label:'Availability service credit',amount:3375,authority:'Service manager',precedent:54,trustOutcome:72},
    {id:'field-cover',label:'Priority field coverage',amount:6800,authority:'VP Customer Operations',precedent:41,trustOutcome:90},
    {id:'adoption-workshop',label:'Inventory adoption workshop',amount:1900,authority:'Customer success director',precedent:27,trustOutcome:80}
  ];
  return [
    {id:'credit',label:'Service credit',amount,authority:amount>5000?'VP Customer Operations':'Service manager',precedent:bounded(Math.round(amount/100),18,82),trustOutcome:bounded(52+Math.round(amount/250),52,89)},
    {id:'extension',label:'Support extension',amount:Math.round(amount*.58),authority:'Service manager',precedent:31,trustOutcome:76},
    {id:'replacement',label:'Priority replacement',amount:Math.round(amount*1.34),authority:'VP Customer Operations',precedent:67,trustOutcome:86},
    {id:'none',label:'No concession',amount:0,authority:'Representative',precedent:4,trustOutcome:38}
  ];
};
export const incidentSignals=(threshold:number):readonly IIncidentSignal[]=>[
  {caseId:'ZCR-1048',similarity:100,related:true,longitude:2.35,latitude:48.86},
  {caseId:'ZCR-1052',similarity:91,related:91>=threshold,longitude:-.13,latitude:51.51},
  {caseId:'ZCR-1061',similarity:88,related:88>=threshold,longitude:4.9,latitude:52.37},
  {caseId:'ZCR-1074',similarity:83,related:83>=threshold,longitude:13.4,latitude:52.52},
  {caseId:'ZCR-1088',similarity:79,related:79>=threshold,longitude:9.19,latitude:45.46},
  {caseId:'ZCR-1093',similarity:74,related:74>=threshold,longitude:2.17,latitude:41.38},
  {caseId:'ZCR-1099',similarity:43,related:false,longitude:18.07,latitude:59.33}
];
export const HERO_CASE=cases.find(item=>item.id==='ZCR-1048') as IServiceCaseRecord;
