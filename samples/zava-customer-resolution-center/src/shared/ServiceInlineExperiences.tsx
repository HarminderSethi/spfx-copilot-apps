import * as React from "react";
import {
  Avatar,
  Badge,
  Button,
  Field,
  Input,
  ProgressBar,
  Select,
  Slider,
  Textarea,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowLeft20Regular,
  ArrowRight20Regular,
  CheckmarkCircle20Filled,
  Clock20Regular,
  DismissCircle20Regular,
  PeopleTeam20Regular,
  Search20Regular,
  ShieldCheckmark20Regular,
  Warning20Filled,
} from "@fluentui/react-icons";
import {
  CASE_SCOPED_INTENTS,
  INTENTS,
  LENS_LABELS,
  type IServiceIntentDefinition,
  type IServiceProperties,
  type ServiceIntentKey,
} from "./catalog";
import { addReceipt } from "./sessionStore";
import { serviceData, topPriorityCases } from "./domain";
import { PERSONA_MEDIA } from "./media";
import {
  CustomerPortfolioMatrix,
  CustomerPromiseConstellation,
  DemandResolutionRiver,
  GlobalServiceMap,
  IncidentEmergenceGraph,
  RecurringDriverPareto,
  WorkloadRiskMatrix,
} from "./visualizations/ServiceCharts";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    minWidth: 0,
  },
  split: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1.25fr) minmax(210px,.75fr)",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 620px)": { gridTemplateColumns: "1fr" },
  },
  three: {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: tokens.spacingHorizontalS,
    "@media (max-width: 560px)": { gridTemplateColumns: "1fr" },
  },
  panel: {
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  soft: {
    backgroundImage: `linear-gradient(145deg, ${tokens.colorNeutralBackground1}, ${tokens.colorBrandBackground2})`,
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  title: { margin: 0, fontSize: tokens.fontSizeBase400 },
  meta: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
  },
  strong: { fontWeight: tokens.fontWeightBold },
  row: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  status: {
    width: "9px",
    height: "9px",
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
  },
  statusWarn: { backgroundColor: tokens.colorPaletteMarigoldBackground3 },
  statusDanger: { backgroundColor: tokens.colorPaletteRedBackground3 },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: tokens.spacingHorizontalS,
    "@media (max-width: 520px)": { gridTemplateColumns: "1fr" },
  },
  wide: { gridColumn: "1/-1" },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
    marginTop: tokens.spacingVerticalM,
  },
  notice: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalS,
    borderLeft: `4px solid ${tokens.colorPaletteMarigoldBorderActive}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  receipt: { borderLeftColor: tokens.colorPaletteGreenBorderActive },
  metric: {
    padding: tokens.spacingHorizontalS,
    borderTop: `3px solid ${tokens.colorPaletteMarigoldBorderActive}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  metricValue: {
    display: "block",
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
  },
  metricLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  people: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  person: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  avatar: { width: "42px", height: "42px" },
  message: {
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
    lineHeight: tokens.lineHeightBase400,
  },
  fact: {
    padding: tokens.spacingHorizontalS,
    borderLeft: `3px solid ${tokens.colorPaletteGreenBorderActive}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  warning: { borderLeftColor: tokens.colorPaletteRedBorderActive },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  step: {
    display: "grid",
    gridTemplateColumns: "28px minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  number: {
    display: "grid",
    placeItems: "center",
    width: "26px",
    height: "26px",
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
  },
  score: {
    display: "grid",
    placeItems: "center",
    width: "100px",
    height: "100px",
    margin: "0 auto",
    borderRadius: tokens.borderRadiusCircular,
    border: `12px solid ${tokens.colorPaletteGreenBorderActive}`,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
  },
  explorer: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) minmax(220px,.6fr)",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 620px)": { gridTemplateColumns: "1fr" },
  },
  scenario: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalS,
    border: 0,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    textAlign: "left",
    color: tokens.colorNeutralForeground1,
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  pager: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
    paddingTop: tokens.spacingVerticalS,
  },
  pagerActions: { display: "flex", gap: tokens.spacingHorizontalXS },
  scopeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },
  scopeSearch: { width: "min(100%,360px)" },
  caseButton: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: tokens.spacingHorizontalS,
    border: 0,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    textAlign: "left",
    color: tokens.colorNeutralForeground1,
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  caseDetail: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: tokens.spacingHorizontalS,
    "@media (max-width: 560px)": {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    },
  },
  empty: {
    display: "grid",
    justifyItems: "center",
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalL,
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  emptyIcon: { fontSize: "28px", color: tokens.colorNeutralForeground2 },
  stageHeading: { outline: "none" },
  compactChart: { maxHeight: "330px", overflow: "hidden" },
  compactSubmit: {
    overflow: "hidden",
    borderTop: `4px solid ${tokens.colorBrandBackground}`,
    backgroundImage: `linear-gradient(155deg, ${tokens.colorNeutralBackground1} 64%, ${tokens.colorBrandBackground2})`,
  },
  stageRail: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
  stageDot: {
    width: "8px",
    height: "8px",
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralStroke1,
  },
  stageDotActive: { backgroundColor: tokens.colorBrandBackground },
  compactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: tokens.spacingHorizontalS,
    "& textarea": { maxHeight: "52px" },
    "@media (max-width: 520px)": { gridTemplateColumns: "1fr" },
  },
  compactWide: { gridColumn: "1/-1" },
  reviewRows: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    "@media (max-width: 520px)": { gridTemplateColumns: "1fr" },
  },
  reviewRow: {
    minWidth: 0,
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  reviewValue: { display: "block", fontWeight: tokens.fontWeightSemibold },
  factChips: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
    marginBottom: tokens.spacingVerticalS,
  },
  factChip: {
    padding: `2px ${tokens.spacingHorizontalXS}`,
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorPaletteGreenForeground1,
    backgroundColor: tokens.colorPaletteGreenBackground1,
    fontSize: tokens.fontSizeBase100,
  },
  compactNotice: { marginTop: tokens.spacingVerticalS },
  contextLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  reviewShell: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0,1fr)",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 620px)": { gridTemplateColumns: "1fr" },
  },
  reviewQueue: {
    minWidth: 0,
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  reviewQueueHidden: {
    "@media (max-width: 620px)": { display: "none" },
  },
  reviewDetailHidden: {
    "@media (max-width: 620px)": { display: "none" },
  },
  reviewQueueButton: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalS,
    border: 0,
    borderLeft: "4px solid transparent",
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    textAlign: "left",
    color: tokens.colorNeutralForeground1,
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  reviewQueueSelected: {
    borderLeftColor: tokens.colorBrandBackground,
    backgroundColor: tokens.colorBrandBackground2,
  },
  reviewDetail: {
    minWidth: 0,
    padding: tokens.spacingHorizontalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `4px solid ${tokens.colorPaletteMarigoldBorderActive}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  reviewToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  narrowOnly: {
    display: "none",
    "@media (max-width: 620px)": { display: "inline-flex" },
  },
  decisionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: tokens.spacingHorizontalS,
    "& textarea": { maxHeight: "52px" },
    "@media (max-width: 520px)": { gridTemplateColumns: "1fr" },
  },
  decisionWide: { gridColumn: "1/-1" },
  miniMetrics: {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: "1px",
    marginBottom: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralStroke2,
  },
  miniMetric: {
    minWidth: 0,
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export interface IVisibleInlineState {
  readonly selectedId?: string;
  readonly customerId?: string;
  readonly query?: string;
  readonly view: "list" | "detail" | "draft" | "review" | "receipt";
  readonly summary: string;
}
const visibleSummary: Readonly<Record<ServiceIntentKey, string>> = {
  TriageCustomerIssue:
    "a structured customer issue intake with resolved customer, product, impact, language, and a reviewable case-creation rationale",
  GetPriorityServiceQueue:
    "a ranked priority queue with customer impact, case symptoms, SLA pressure, and inspectable priority scores",
  ExploreCustomerHealth:
    "a customer value-and-risk portfolio when unscoped, or a relationship constellation and health metrics for the selected customer",
  BuildResolutionPlan: "an evidence ledger beside an ordered, grounded resolution plan with owners and progress",
  StartExpertSwarm: "matched specialists, availability, skills, and a reviewed evidence-minimized handoff question",
  DetectServiceIncident: "an interactive similarity threshold, related-case network, contrary case, and exact cohort table",
  ReviewIncidentResponse: "an incident cohort graph beside a guarded declaration, monitor, escalation, or closure decision",
  ReviewServiceRecovery: "recovery scenarios comparing cost, authority, precedent, and expected customer trust outcome",
  ComposeCustomerUpdate:
    "an editable customer-safe update with explicit facts, promises, language, and review-before-send controls",
  TrackResolutionOutcome: "a resolution confidence score with SLA, verified sites, reopen risk, recovery cost, and next check",
  CreateKnowledgeFromResolution:
    "verified resolution evidence beside an editable knowledge draft with applicability and exclusions",
  ExploreServicePerformance: "a demand-to-resolution river with peak volume, current backlog, trend direction, and exact values",
  ExploreRegionalServiceImpact:
    "a projected regional impact map with selectable geography, case volume, SLA risk, recovery exposure, and exact values",
  ExploreRecurringServiceDrivers: "a recurring-driver Pareto chart ranking causes by case volume and share of avoidable demand",
  DiagnoseCaseEvidence: "verified and contrary evidence beside competing diagnostic hypotheses and confidence",
  ReviewEntitlementCoverage: "effective agreement coverage, SLA obligations, remedy authority, clauses, and exclusions",
  ManageCaseEscalation: "team capacity and SLA risk beside a guarded escalation package with ownership and acceptance criteria",
  BalanceServiceWorkload: "a capacity-versus-SLA-risk matrix sized by open demand with an intervention recommendation",
  CoordinateFieldService: "site readiness, assigned people, parts and access windows beside a reviewed dispatch plan",
  ManageCustomerCommitments:
    "a bilateral promise ledger with owners, due times, risk, evidence, and a guarded commitment decision",
  RunServiceQualityReview: "transparent quality criteria and evidence beside an accountable coaching or remediation decision",
  PlanCustomerWinBack: "a customer promise constellation beside a guarded trust-recovery plan with owners and measures",
  ExploreAgentCapabilities: "a searchable gallery of operational scenarios with selected safe preview and a reusable prompt",
};
const visibleStateFor = (definition: IServiceIntentDefinition, properties: IServiceProperties): IVisibleInlineState => ({
  selectedId: properties.selectedId,
  customerId: properties.customerId,
  query: properties.query,
  view: "detail",
  summary: `${definition.title} is showing ${visibleSummary[definition.key]}.`,
});
const caseScoped = (definition: IServiceIntentDefinition): boolean => CASE_SCOPED_INTENTS.has(definition.key);
function CaseReviewScope(props: {
  readonly definition: IServiceIntentDefinition;
  readonly properties: IServiceProperties;
  readonly children: React.ReactNode;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const aggregate = serviceData.getAggregate();
  const requestedId = props.properties.caseId;
  const [selectedId, setSelectedId] = React.useState<string | undefined>(requestedId);
  const [query, setQuery] = React.useState(props.properties.query || "");
  const rankedIds = React.useMemo(
    () => new Map(topPriorityCases(40).map((item, index) => [item.caseId, { score: item.score, rank: index + 1 }])),
    [],
  );
  const selected = selectedId ? serviceData.getCase(selectedId) : undefined;
  const customer = selected ? aggregate.customers.find((item) => item.id === selected.customerId) : undefined;
  const normalized = query.trim().toLowerCase();
  const results = aggregate.cases
    .filter(
      (item) =>
        item.status !== "resolved" &&
        (!normalized ||
          `${item.id} ${item.symptom} ${item.product} ${aggregate.customers.find((customerItem) => customerItem.id === item.customerId)?.name || ""}`
            .toLowerCase()
            .includes(normalized)),
    )
    .sort((left, right) => (rankedIds.get(left.id)?.rank || 999) - (rankedIds.get(right.id)?.rank || 999))
    .slice(0, 8);
  React.useEffect(() => {
    const purpose = visibleSummary[props.definition.key];
    const summary = selected
      ? `${props.definition.title} is showing ${selected.id} for ${customer?.name || "an unknown customer"}: severity ${selected.severity}, ${selected.status}, ${selected.affectedSites} affected sites; the component contains ${purpose}.`
      : `${props.definition.title} is showing a searchable case list${query ? ` filtered by ${query}` : ""} with ${results.length} visible results before opening ${purpose}.`;
    props.onVisibleStateChange?.({
      selectedId: selected?.id || selectedId,
      customerId: customer?.id,
      query,
      view: selectedId ? "detail" : "list",
      summary,
    });
  }, [
    customer?.id,
    customer?.name,
    props.definition.key,
    props.definition.title,
    props.onVisibleStateChange,
    query,
    results.length,
    selected,
    selectedId,
  ]);
  if (selectedId) {
    return (
      <div className={s.root} data-layout={`${props.definition.key}-case-detail`} data-review-view="detail">
        <section className={`${s.panel} ${s.soft}`}>
          <div className={s.scopeHeader}>
            <Button appearance="subtle" icon={<ArrowLeft20Regular />} onClick={() => setSelectedId(undefined)}>
              Back to case search
            </Button>
            <Badge appearance="tint" color={selected ? "success" : "danger"}>
              {selected?.id || "Case not found"}
            </Badge>
          </div>
          {selected ? (
            <>
              <div className={s.heading}>
                <span>
                  <h3 className={s.title}>{customer?.name}</h3>
                  <span className={s.meta}>
                    {selected.symptom} · {selected.product} {selected.version}
                  </span>
                </span>
                <Badge color={selected.severity === 1 ? "danger" : "warning"}>Severity {selected.severity}</Badge>
              </div>
              <div className={s.caseDetail}>
                {[
                  ["Status", selected.status],
                  ["Owner", selected.owner],
                  ["Affected sites", String(selected.affectedSites)],
                  ["Channel", selected.channel],
                ].map((item) => (
                  <div className={s.metric} key={item[0]}>
                    <b className={s.metricValue}>{item[1]}</b>
                    <span className={s.metricLabel}>{item[0]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={s.empty}>
              No case matches <b>{selectedId}</b>. Return to search to choose another item.
            </div>
          )}
        </section>
        {selected && props.children}
      </div>
    );
  }
  return (
    <section className={s.panel} data-layout={`${props.definition.key}-case-search`} data-review-view="list">
      <div className={s.scopeHeader}>
        <span>
          <h3 className={s.title}>Choose a case to review</h3>
          <span className={s.meta}>Search by case ID, customer, issue, or product.</span>
        </span>
        <Input
          className={s.scopeSearch}
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          placeholder="Search cases"
          aria-label="Search cases"
        />
      </div>
      {results.length ? (
        results.map((item) => {
          const itemCustomer = aggregate.customers.find((entry) => entry.id === item.customerId);
          return (
            <button className={s.caseButton} key={item.id} onClick={() => setSelectedId(item.id)}>
              <span>
                <b>
                  {item.id} · {itemCustomer?.name}
                </b>
                <br />
                <span className={s.meta}>
                  {item.symptom} · {item.affectedSites} sites · {item.owner}
                </span>
              </span>
              <ArrowRight20Regular />
            </button>
          );
        })
      ) : (
        <div className={s.empty}>No cases match this search.</div>
      )}
    </section>
  );
}

type Stage = "draft" | "review" | "receipt";
function OperationFlow(props: {
  readonly definition: IServiceIntentDefinition;
  readonly user: string;
  readonly initial: string;
  readonly reviewLabel: string;
  readonly consequence: string;
  readonly confirmLabel: string;
}): React.ReactElement {
  const s = useStyles();
  const [stage, setStage] = React.useState<Stage>("draft");
  const [value, setValue] = React.useState(props.initial);
  const [receipt, setReceipt] = React.useState("");
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const initialStage = React.useRef(true);
  React.useEffect(() => {
    if (initialStage.current) {
      initialStage.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stage]);
  const confirm = (): void => {
    setReceipt(addReceipt(props.definition.key, props.user, value).id);
    setStage("receipt");
  };
  const heading = stage === "draft" ? props.reviewLabel : stage === "review" ? "Review consequence" : "Session receipt";
  return (
    <section className={s.panel} data-layout={`${props.definition.key}-${stage}`}>
      <div className={s.heading}>
        <h3 ref={headingRef} tabIndex={-1} className={`${s.title} ${s.stageHeading}`}>
          {heading}
        </h3>
        <Badge appearance="tint" color={stage === "receipt" ? "success" : "warning"}>
          {stage}
        </Badge>
      </div>
      <div aria-live="polite" aria-atomic="true" className={s.meta}>
        {stage === "review"
          ? "Review the consequence before confirming."
          : stage === "receipt"
            ? "Session receipt recorded. No tenant record changed."
            : ""}
      </div>
      {stage === "receipt" ? (
        <div className={`${s.notice} ${s.receipt}`}>
          <CheckmarkCircle20Filled />
          <span>
            <b>{receipt}</b>
            <br />
            <span className={s.meta}>Recorded for this demo session. No tenant record changed.</span>
          </span>
        </div>
      ) : stage === "review" ? (
        <>
          <p className={s.message}>{value}</p>
          <div className={s.notice}>
            <Warning20Filled />
            <span>{props.consequence}</span>
          </div>
        </>
      ) : (
        <Field label={props.reviewLabel} required>
          <Textarea value={value} onChange={(_, data) => setValue(data.value)} />
        </Field>
      )}
      <div className={s.actions}>
        {stage === "draft" && (
          <Button appearance="primary" disabled={!value.trim()} onClick={() => setStage("review")}>
            Review
          </Button>
        )}
        {stage === "review" && (
          <>
            <Button onClick={() => setStage("draft")}>Edit</Button>
            <Button appearance="primary" onClick={confirm}>
              {props.confirmLabel}
            </Button>
          </>
        )}
        {stage === "receipt" && (
          <Button
            onClick={() => {
              setValue(props.initial);
              setStage("draft");
            }}
          >
            Reset
          </Button>
        )}
      </div>
    </section>
  );
}
interface ICompactSubmitFlowProps {
  readonly definition: IServiceIntentDefinition;
  readonly user: string;
  readonly title: string;
  readonly valid: boolean;
  readonly validationMessage: string;
  readonly reviewRows: readonly (readonly [string, string])[];
  readonly consequence: string;
  readonly confirmLabel: string;
  readonly summary: string;
  readonly selectedId?: string;
  readonly customerId?: string;
  readonly onReset: () => void;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
  readonly children: React.ReactNode;
}
function CompactSubmitFlow(props: ICompactSubmitFlowProps): React.ReactElement {
  const s = useStyles();
  const [stage, setStage] = React.useState<Stage>("draft");
  const [receipt, setReceipt] = React.useState("");
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const summaryRef = React.useRef(props.summary);
  summaryRef.current = props.summary;
  React.useEffect(() => {
    headingRef.current?.focus();
    props.onVisibleStateChange?.({
      selectedId: props.selectedId,
      customerId: props.customerId,
      view: stage,
      summary: `${props.definition.title} is in ${stage} stage. ${summaryRef.current}`,
    });
  }, [props.customerId, props.definition.title, props.onVisibleStateChange, props.selectedId, stage]);
  const confirm = (): void => {
    setReceipt(addReceipt(props.definition.key, props.user, props.summary).id);
    setStage("receipt");
  };
  const reset = (): void => {
    props.onReset();
    setReceipt("");
    setStage("draft");
  };
  return (
    <section
      className={`${s.panel} ${s.compactSubmit}`}
      data-layout={`${props.definition.key}-compact-${stage}`}
      data-submit-stage={stage}
    >
      <div className={s.heading}>
        <span>
          <h3 ref={headingRef} tabIndex={-1} className={`${s.title} ${s.stageHeading}`}>
            {stage === "draft" ? props.title : stage === "review" ? "Check before confirming" : "Ready for the next customer"}
          </h3>
          <span className={s.meta}>
            {stage === "draft"
              ? "Only the essential details are required."
              : stage === "review"
                ? "No tenant record changes until you confirm."
                : "This demo receipt is stored only for the session."}
          </span>
        </span>
        <span className={s.stageRail} aria-label={`Stage ${stage}`}>
          {(["draft", "review", "receipt"] as const).map((item) => (
            <span key={item} title={item} className={`${s.stageDot} ${item === stage ? s.stageDotActive : ""}`} />
          ))}
        </span>
      </div>
      {stage === "draft" ? (
        <>
          {props.children}
          {!props.valid && (
            <div className={`${s.notice} ${s.compactNotice}`}>
              <Warning20Filled />
              <span>{props.validationMessage}</span>
            </div>
          )}
        </>
      ) : stage === "review" ? (
        <>
          <div className={s.reviewRows}>
            {props.reviewRows.map((item) => (
              <div className={s.reviewRow} key={item[0]}>
                <span className={s.meta}>{item[0]}</span>
                <span className={s.reviewValue}>{item[1]}</span>
              </div>
            ))}
          </div>
          <div className={`${s.notice} ${s.compactNotice}`}>
            <ShieldCheckmark20Regular />
            <span>{props.consequence}</span>
          </div>
        </>
      ) : (
        <div className={`${s.notice} ${s.receipt}`}>
          <CheckmarkCircle20Filled />
          <span>
            <b>{receipt}</b>
            <br />
            <span className={s.meta}>Confirmed for this demo session. No tenant record changed.</span>
          </span>
        </div>
      )}
      <div className={s.actions}>
        {stage === "draft" && (
          <Button appearance="primary" disabled={!props.valid} onClick={() => setStage("review")}>
            Review
          </Button>
        )}
        {stage === "review" && (
          <>
            <Button onClick={() => setStage("draft")}>Edit</Button>
            <Button appearance="primary" onClick={confirm}>
              {props.confirmLabel}
            </Button>
          </>
        )}
        {stage === "receipt" && (
          <Button appearance="primary" onClick={reset}>
            Start another
          </Button>
        )}
      </div>
    </section>
  );
}
function EvidenceLedger(): React.ReactElement {
  const s = useStyles();
  return (
    <section className={`${s.panel} ${s.soft}`}>
      <div className={s.heading}>
        <h3 className={s.title}>Evidence ledger</h3>
        <Badge appearance="tint" color="success">
          5 sources
        </Badge>
      </div>
      {serviceData.getAggregate().evidence.map((item) => (
        <div className={s.row} key={item.id}>
          <span className={`${s.status} ${item.kind === "contrary" || item.kind === "gap" ? s.statusDanger : ""}`} />
          <span>
            <b>{item.kind}</b>
            <br />
            <span className={s.meta}>{item.label}</span>
          </span>
          <span className={s.meta}>{item.confidence}%</span>
        </div>
      ))}
    </section>
  );
}
function PriorityQueue(): React.ReactElement {
  const s = useStyles();
  const data = serviceData.getAggregate();
  return (
    <section className={s.panel}>
      {topPriorityCases(5).map((item, index) => {
        const record = data.cases.find((entry) => entry.id === item.caseId);
        const customer = data.customers.find((entry) => entry.id === record?.customerId);
        return (
          <div className={s.row} key={item.caseId}>
            <span className={index < 2 ? `${s.status} ${s.statusDanger}` : s.status} />
            <span>
              <b>{customer?.name}</b>
              <br />
              <span className={s.meta}>
                {item.caseId} · {record?.symptom}
              </span>
            </span>
            <Badge appearance="tint" color={index < 2 ? "danger" : "warning"}>
              {item.score}
            </Badge>
          </div>
        );
      })}
    </section>
  );
}
function ExpertList(): React.ReactElement {
  const s = useStyles();
  return (
    <section className={s.panel}>
      <div className={s.heading}>
        <h3 className={s.title}>Specialists matched to the decision</h3>
        <PeopleTeam20Regular />
      </div>
      <div className={s.people}>
        {serviceData.getAggregate().experts.map((item) => (
          <div className={s.person} key={item.id}>
            <Avatar
              className={s.avatar}
              image={PERSONA_MEDIA[item.name] ? { src: PERSONA_MEDIA[item.name].src } : undefined}
              name={item.name}
            />
            <span>
              <b>{item.name}</b>
              <br />
              <span className={s.meta}>
                {item.role} · {item.skills.join(", ")}
              </span>
            </span>
            <Badge appearance="tint" color="success">
              {item.availableInMinutes}m
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
function ResolutionSteps(): React.ReactElement {
  const s = useStyles();
  return (
    <section className={s.panel}>
      <div className={s.heading}>
        <h3 className={s.title}>Evidence-linked plan</h3>
        <Badge appearance="tint" color="success">
          86% grounded
        </Badge>
      </div>
      <div className={s.steps}>
        {[
          ["Verify rollback across three cohorts", "Pradeep · 22m"],
          ["Stage remaining stores by region", "Amina · 58m"],
          ["Confirm launch readiness", "Megan · 2h"],
        ].map((item, index) => (
          <div className={s.step} key={item[0]}>
            <span className={s.number}>{index + 1}</span>
            <span>
              <b>{item[0]}</b>
              <ProgressBar value={[0.92, 0.71, 0.54][index]} />
            </span>
            <span className={s.meta}>{item[1]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
interface ITriageDraft {
  readonly issue: string;
  readonly customer: string;
  readonly product: string;
  readonly impact: string;
}
function Triage(props: {
  readonly d: IServiceIntentDefinition;
  readonly p: IServiceProperties;
  readonly user: string;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const initial = React.useMemo<ITriageDraft>(
    () => ({
      issue: props.p.message || "42 stores cannot activate their new handhelds.",
      customer: props.p.customerHint || "Alpine House",
      product: props.p.productHint || "Zava Handheld 8.4.12",
      impact: "Store launch blocked",
    }),
    [props.p.customerHint, props.p.message, props.p.productHint],
  );
  const [draft, setDraft] = React.useState(initial);
  const update = (key: keyof ITriageDraft, value: string): void => setDraft((current) => ({ ...current, [key]: value }));
  const valid = Boolean(draft.issue.trim() && draft.customer.trim() && draft.product && draft.impact);
  return (
    <div data-layout="triage-compact-customer-intake">
      <CompactSubmitFlow
        definition={props.d}
        user={props.user}
        title="Create a customer support case"
        valid={valid}
        validationMessage="Add the customer and reported issue before review."
        reviewRows={[
          ["Customer", draft.customer],
          ["Reported issue", draft.issue],
          ["Product", draft.product],
          ["Impact", draft.impact],
          ["Entitlement", "Enterprise launch coverage"],
          ["SLA", "15m response · 6h resolution"],
        ]}
        consequence="Creates a session-only Severity 1 case and starts the six-hour resolution clock."
        confirmLabel="Create case"
        summary={`Customer ${draft.customer}; ${draft.impact}; ${draft.product}.`}
        customerId="alpine-house"
        onReset={() => setDraft(initial)}
        onVisibleStateChange={props.onVisibleStateChange}
      >
        <div className={s.compactGrid}>
          <Field className={s.compactWide} label="What did the customer report?" required>
            <Textarea rows={2} value={draft.issue} onChange={(_, data) => update("issue", data.value)} />
          </Field>
          <Field label="Customer" required>
            <Input value={draft.customer} onChange={(_, data) => update("customer", data.value)} />
          </Field>
          <Field label="Product">
            <Select value={draft.product} onChange={(_, data) => update("product", data.value)}>
              <option>Zava Handheld 8.4.12</option>
              <option>Zava Commerce</option>
            </Select>
          </Field>
          <Field className={s.compactWide} label="Business impact">
            <Select value={draft.impact} onChange={(_, data) => update("impact", data.value)}>
              <option>Store launch blocked</option>
              <option>Customer operation degraded</option>
              <option>Single user blocked</option>
            </Select>
          </Field>
        </div>
        <div className={`${s.notice} ${s.compactNotice}`}>
          <Clock20Regular />
          <span>
            <b>Enterprise launch coverage</b>
            <br />
            <span className={s.meta}>15-minute response · 6-hour resolution target</span>
          </span>
        </div>
      </CompactSubmitFlow>
    </div>
  );
}
interface ICustomerUpdateDraft {
  readonly recipient: string;
  readonly channel: string;
  readonly language: string;
  readonly nextUpdate: string;
  readonly message: string;
}
function CustomerUpdate(props: {
  readonly d: IServiceIntentDefinition;
  readonly p: IServiceProperties;
  readonly user: string;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const caseId = props.p.caseId || "ZCR-1048";
  const initial = React.useMemo<ICustomerUpdateDraft>(
    () => ({
      recipient: "Luc Dubois · Alpine House",
      channel: props.p.channel || "Email",
      language: props.p.language || "French + English",
      nextUpdate: "45 minutes",
      message:
        "We verified a firmware issue affecting activation. Rollback is working, and we will update you again in 45 minutes.",
    }),
    [props.p.channel, props.p.language],
  );
  const [draft, setDraft] = React.useState(initial);
  const update = (key: keyof ICustomerUpdateDraft, value: string): void => setDraft((current) => ({ ...current, [key]: value }));
  const valid = Boolean(draft.recipient && draft.message.trim() && draft.nextUpdate.trim());
  return (
    <div data-layout="customer-update-compact-trust-studio">
      <CompactSubmitFlow
        definition={props.d}
        user={props.user}
        title="Prepare a customer-safe update"
        valid={valid}
        validationMessage="Add a recipient, message, and next-update promise before review."
        reviewRows={[
          ["Case", caseId],
          ["Recipient", draft.recipient],
          ["Channel", draft.channel],
          ["Language", draft.language],
          ["Next update", draft.nextUpdate],
          ["Message", draft.message],
        ]}
        consequence="Sends only verified facts to Luc Dubois and records one explicit next-update promise."
        confirmLabel="Confirm mock send"
        summary={`Case ${caseId}; ${draft.channel}; ${draft.language}; next update in ${draft.nextUpdate}.`}
        selectedId={caseId}
        customerId="alpine-house"
        onReset={() => setDraft(initial)}
        onVisibleStateChange={props.onVisibleStateChange}
      >
        <div className={s.contextLine}>
          <span>
            <b>{caseId} · Alpine House</b>
            <br />
            <span className={s.meta}>Activation recovery · customer communication</span>
          </span>
          <Badge appearance="tint" color="success">
            3 verified facts
          </Badge>
        </div>
        <div className={s.factChips}>
          <span className={s.factChip}>Firmware issue verified</span>
          <span className={s.factChip}>Rollback working</span>
          <span className={s.factChip}>39 of 42 stores restored</span>
        </div>
        <div className={s.compactGrid}>
          <Field label="Recipient">
            <Input value={draft.recipient} onChange={(_, data) => update("recipient", data.value)} />
          </Field>
          <Field label="Channel">
            <Select value={draft.channel} onChange={(_, data) => update("channel", data.value)}>
              <option>Email</option>
              <option>Teams</option>
              <option>SMS</option>
            </Select>
          </Field>
          <Field label="Language">
            <Select value={draft.language} onChange={(_, data) => update("language", data.value)}>
              <option>French + English</option>
              <option>English</option>
              <option>French</option>
            </Select>
          </Field>
          <Field label="Next update">
            <Input value={draft.nextUpdate} onChange={(_, data) => update("nextUpdate", data.value)} />
          </Field>
          <Field className={s.compactWide} label="Customer message" required>
            <Textarea rows={2} value={draft.message} onChange={(_, data) => update("message", data.value)} />
          </Field>
        </div>
      </CompactSubmitFlow>
    </div>
  );
}
interface IReviewQueueItem {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
  readonly urgency: string;
  readonly metrics: readonly (readonly [string, string])[];
}
const incidentReviewItems: readonly IReviewQueueItem[] = [
  {
    id: "INC-241",
    title: "Activation 8.4.12",
    meta: "6 cases · 42 stores",
    urgency: "91%",
    metrics: [
      ["Customers", "4"],
      ["SLA at risk", "€186K"],
      ["Confidence", "91%"],
    ],
  },
  {
    id: "INC-238",
    title: "Payment reconciliation",
    meta: "4 cases · 18 stores",
    urgency: "78%",
    metrics: [
      ["Customers", "3"],
      ["SLA at risk", "€74K"],
      ["Confidence", "78%"],
    ],
  },
  {
    id: "INC-233",
    title: "Inventory availability",
    meta: "3 cases · 11 stores",
    urgency: "64%",
    metrics: [
      ["Customers", "2"],
      ["SLA at risk", "€39K"],
      ["Confidence", "64%"],
    ],
  },
];
const recoveryReviewItems: readonly IReviewQueueItem[] = [
  {
    id: "ZCR-1048",
    title: "Alpine House",
    meta: "Launch commitment missed",
    urgency: "€4.2K",
    metrics: [
      ["Authority", "Manager"],
      ["Trust lift", "+18"],
      ["Precedent", "Low"],
    ],
  },
  {
    id: "ZCR-1001",
    title: "Northwind Traders",
    meta: "Delivery synchronization",
    urgency: "€6.0K",
    metrics: [
      ["Authority", "Director"],
      ["Trust lift", "+14"],
      ["Precedent", "Medium"],
    ],
  },
  {
    id: "ZCR-1003",
    title: "Fabrikam Stores",
    meta: "Inventory disruption",
    urgency: "€2.5K",
    metrics: [
      ["Authority", "Manager"],
      ["Trust lift", "+11"],
      ["Precedent", "Low"],
    ],
  },
];
function FlagshipReview(props: {
  readonly kind: "incident" | "recovery";
  readonly definition: IServiceIntentDefinition;
  readonly user: string;
  readonly amount?: number;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const items = props.kind === "incident" ? incidentReviewItems : recoveryReviewItems;
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>("draft");
  const [mobileDetail, setMobileDetail] = React.useState(true);
  const [decision, setDecision] = React.useState(props.kind === "incident" ? "Monitor" : "Approve");
  const [secondary, setSecondary] = React.useState(props.kind === "incident" ? "30 minutes" : String(props.amount || 4200));
  const [rationale, setRationale] = React.useState(
    props.kind === "incident"
      ? "Firmware and timing signals are strong; keep the contrary network case visible."
      : "Restore the launch commitment within manager authority and verify adoption after 30 days.",
  );
  const [receipt, setReceipt] = React.useState("");
  const [completed, setCompleted] = React.useState<ReadonlySet<string>>(new Set());
  const selected = items[selectedIndex];
  const allComplete = completed.size === items.length;
  const resetFields = React.useCallback((): void => {
    setDecision(props.kind === "incident" ? "Monitor" : "Approve");
    setSecondary(props.kind === "incident" ? "30 minutes" : String(props.amount || 4200));
    setRationale(
      props.kind === "incident"
        ? "Firmware and timing signals are strong; keep the contrary network case visible."
        : "Restore the launch commitment within manager authority and verify adoption after 30 days.",
    );
  }, [props.amount, props.kind]);
  React.useEffect(() => {
    props.onVisibleStateChange?.({
      selectedId: selected.id,
      customerId: props.kind === "recovery" ? "alpine-house" : undefined,
      view: stage,
      summary: `${props.definition.title} is reviewing ${selected.id}: ${decision}; ${items.length - completed.size} items remain.`,
    });
  }, [
    completed.size,
    decision,
    items.length,
    props.definition.title,
    props.kind,
    props.onVisibleStateChange,
    selected.id,
    stage,
  ]);
  const choose = (index: number): void => {
    setSelectedIndex(index);
    setStage("draft");
    setMobileDetail(true);
    resetFields();
  };
  const confirm = (): void => {
    const actedId = selected.id;
    setReceipt(addReceipt(props.definition.key, props.user, `${actedId}: ${decision}. ${rationale}`).id);
    setCompleted((current) => new Set([...Array.from(current), actedId]));
    if (selectedIndex < items.length - 1) setSelectedIndex(selectedIndex + 1);
    setStage("receipt");
  };
  const continueReview = (): void => {
    if (allComplete) {
      setMobileDetail(false);
      return;
    }
    resetFields();
    setReceipt("");
    setStage("draft");
  };
  const previous = (): void => choose(Math.max(0, selectedIndex - 1));
  const next = (): void => choose(Math.min(items.length - 1, selectedIndex + 1));
  const consequence =
    props.kind === "incident"
      ? `${decision} sets the operational audience and ${secondary} update cadence; no incident record changes until confirmed.`
      : `${decision} at €${Number(secondary || 0).toLocaleString("en-US")} is checked against authority, precedent, and expected customer outcome.`;
  return (
    <div
      className={s.reviewShell}
      data-layout={
        props.kind === "incident" ? "incident-candidate-compact-review-queue" : "service-recovery-compact-review-queue"
      }
      data-review-view={mobileDetail ? "detail" : "list"}
      data-review-stage={stage}
    >
      <section
        className={`${s.reviewQueue} ${mobileDetail ? s.reviewQueueHidden : ""}`}
        aria-label={props.kind === "incident" ? "Incident candidates" : "Recovery requests"}
      >
        <div className={s.heading}>
          <span>
            <h3 className={s.title}>{props.kind === "incident" ? "Incident candidates" : "Recovery requests"}</h3>
            <span className={s.meta}>{items.length - completed.size} awaiting judgment</span>
          </span>
          <Badge appearance="tint" color="warning">
            {items.length}
          </Badge>
        </div>
        {allComplete && <div className={`${s.notice} ${s.receipt}`}><CheckmarkCircle20Filled/><span><b>All reviews complete</b><br/><span className={s.meta}>No pending items remain in this demo queue.</span></span></div>}
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`${s.reviewQueueButton} ${index === selectedIndex ? s.reviewQueueSelected : ""}`}
            aria-pressed={index === selectedIndex}
            onClick={() => choose(index)}
          >
            <span>
              <b>{item.title}</b>
              <br />
              <span className={s.meta}>
                {item.id} · {item.meta}
              </span>
            </span>
            <Badge appearance="tint" color={completed.has(item.id) ? "success" : index === 0 ? "danger" : "warning"}>
              {completed.has(item.id) ? "Done" : item.urgency}
            </Badge>
          </button>
        ))}
      </section>
      <section className={`${s.reviewDetail} ${!mobileDetail ? s.reviewDetailHidden : ""}`}>
        <div className={s.reviewToolbar}>
          <Button
            className={s.narrowOnly}
            appearance="subtle"
            icon={<ArrowLeft20Regular />}
            onClick={() => setMobileDetail(false)}
          >
            Back to reviews
          </Button>
          <span className={s.meta}>
            Item {selectedIndex + 1} of {items.length}
          </span>
          <span>
            <Button
              appearance="subtle"
              icon={<ArrowLeft20Regular />}
              aria-label="Previous review"
              disabled={selectedIndex === 0}
              onClick={previous}
            />
            <Button
              appearance="subtle"
              icon={<ArrowRight20Regular />}
              aria-label="Next review"
              disabled={selectedIndex === items.length - 1}
              onClick={next}
            />
          </span>
        </div>
        <div className={s.heading}>
          <span>
            <h3 className={s.title}>{stage === "receipt" ? "Decision recorded" : selected.title}</h3>
            <span className={s.meta}>
              {stage === "receipt" ? `Next up: ${selected.id}` : `${selected.id} · ${selected.meta}`}
            </span>
          </span>
          <Badge appearance="tint" color={stage === "receipt" ? "success" : "warning"}>
            {stage}
          </Badge>
        </div>
        {stage === "receipt" ? (
          <>
            <div className={`${s.notice} ${s.receipt}`}>
              <CheckmarkCircle20Filled />
              <span>
                <b>{receipt}</b>
                <br />
                <span className={s.meta}>Session receipt recorded. The queue advanced without changing a tenant record.</span>
              </span>
            </div>
            <div className={s.actions}>
              <Button appearance="primary" onClick={continueReview}>
                {allComplete ? "Finish review" : "Review next item"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {stage === "draft" && (
              <div className={s.miniMetrics}>
                {selected.metrics.map((metric) => (
                  <div className={s.miniMetric} key={metric[0]}>
                    <span className={s.meta}>{metric[0]}</span>
                    <b className={s.reviewValue}>{metric[1]}</b>
                  </div>
                ))}
              </div>
            )}
            {stage === "draft" ? (
              <div className={s.decisionGrid}>
                <Field label="Decision">
                  <Select value={decision} onChange={(_, data) => setDecision(data.value)}>
                    {(props.kind === "incident"
                      ? ["Declare", "Monitor", "Close"]
                      : ["Approve", "Request approval", "Decline"]
                    ).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </Field>
                <Field label={props.kind === "incident" ? "Update cadence" : "Recovery amount (€)"}>
                  {props.kind === "incident" ? (
                    <Select value={secondary} onChange={(_, data) => setSecondary(data.value)}>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>60 minutes</option>
                    </Select>
                  ) : (
                    <Input type="number" value={secondary} onChange={(_, data) => setSecondary(data.value)} />
                  )}
                </Field>
                <Field className={s.decisionWide} label="Decision rationale" required>
                  <Textarea rows={2} value={rationale} onChange={(_, data) => setRationale(data.value)} />
                </Field>
              </div>
            ) : (
              <div className={s.reviewRows}>
                {[
                  ["Decision", decision],
                  [
                    props.kind === "incident" ? "Cadence" : "Amount",
                    props.kind === "incident" ? secondary : `€${Number(secondary || 0).toLocaleString("en-US")}`,
                  ],
                  ["Rationale", rationale],
                ].map((row) => (
                  <div className={s.reviewRow} key={row[0]}>
                    <span className={s.meta}>{row[0]}</span>
                    <span className={s.reviewValue}>{row[1]}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={`${s.notice} ${s.compactNotice}`}>
              <Warning20Filled />
              <span>{consequence}</span>
            </div>
            <div className={s.actions}>
              {stage === "draft" ? (
                <Button appearance="primary" disabled={!rationale.trim()} onClick={() => setStage("review")}>
                  Review decision
                </Button>
              ) : (
                <>
                  <Button onClick={() => setStage("draft")}>Edit</Button>
                  <Button appearance="primary" onClick={confirm}>
                    Confirm {decision.toLowerCase()}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
function CustomerHealth(props: { readonly customerId?: string }): React.ReactElement {
  const s = useStyles();
  const data = serviceData.getAggregate();
  const customer = data.customers.find((item) => item.id === props.customerId);
  if (!customer)
    return (
      <div className={s.root} data-layout="customer-health-portfolio-matrix">
        <CustomerPortfolioMatrix />
      </div>
    );
  return (
    <div className={s.root} data-layout="customer-health-relationship-constellation">
      <CustomerPromiseConstellation
        customerName={customer.name}
        health={customer.health}
        goal={customer.primaryGoal}
        sites={customer.sites}
      />
      <div className={s.three}>
        {[
          ["Customer sites", String(customer.sites)],
          ["Service health", String(customer.health)],
          [
            "Renewal exposure",
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            }).format(customer.annualExposure),
          ],
        ].map((item) => (
          <div className={s.metric} key={item[0]}>
            <b className={s.metricValue}>{item[1]}</b>
            <span className={s.metricLabel}>{item[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function IncidentDetection(props: {
  readonly initialThreshold: number;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const [threshold, setThreshold] = React.useState(props.initialThreshold);
  React.useEffect(() => {
    const related =
      serviceData.getAggregate().cases.length && threshold <= 74
        ? 6
        : threshold <= 79
          ? 5
          : threshold <= 83
            ? 4
            : threshold <= 88
              ? 3
              : threshold <= 91
                ? 2
                : 1;
    props.onVisibleStateChange?.({
      view: "detail",
      query: `similarity >= ${threshold}%`,
      summary: `Detect service incident is showing ${related} related activation cases at a ${threshold}% similarity threshold, with one contrary case.`,
    });
  }, [props.onVisibleStateChange, threshold]);
  return (
    <div className={s.root} data-layout="incident-detection-threshold-graph">
      <IncidentEmergenceGraph
        threshold={threshold}
        control={
          <Field label={`Minimum similarity ${threshold}%`}>
            <Slider min={40} max={95} step={1} value={threshold} onChange={(_, data) => setThreshold(data.value)} />
          </Field>
        }
      />
    </div>
  );
}
function Diagnostics(): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="diagnostics-competing-hypotheses">
      <EvidenceLedger />
      <section className={s.panel}>
        <h3 className={s.title}>Hypothesis support</h3>
        {[
          ["Firmware regression", 0.92, "92%"],
          ["Store network", 0.18, "18%"],
          ["Entitlement cache", 0.37, "37%"],
        ].map((item) => (
          <div className={s.row} key={String(item[0])}>
            <span>{item[0]}</span>
            <ProgressBar value={Number(item[1])} />
            <Badge>{item[2]}</Badge>
          </div>
        ))}
        <div className={s.notice}>
          <ShieldCheckmark20Regular />
          Rejecting the network inference promotes rollback verification into the plan.
        </div>
      </section>
    </div>
  );
}
function Entitlement(): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="entitlement-effective-clause-ledger">
      <section className={s.panel}>
        <h3 className={s.title}>Effective coverage</h3>
        {[
          ["Enterprise launch cover", "Active"],
          ["Response target", "15 minutes"],
          ["Resolution target", "6 hours"],
          ["On-site dispatch", "Included"],
          ["Service credit", "Manager to €5,000"],
        ].map((item) => (
          <div className={s.row} key={item[0]}>
            <Clock20Regular />
            <span>{item[0]}</span>
            <b>{item[1]}</b>
          </div>
        ))}
      </section>
      <section className={s.panel}>
        <h3 className={s.title}>Clause evidence</h3>
        <p className={s.fact}>
          <b>MSA 4.2</b>
          <br />
          Launch-blocking activation failure qualifies as Severity 1.
        </p>
        <p className={`${s.fact} ${s.warning}`}>
          <b>Exclusion</b>
          <br />
          Customer-managed network failures are excluded; current diagnostics contradict this cause.
        </p>
      </section>
    </div>
  );
}
function Workload(): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.root} data-layout="workload-capacity-risk-matrix">
      <WorkloadRiskMatrix />
      <div className={s.notice}>
        <Warning20Filled />
        Moving activation diagnostics to Reliability protects 42 minutes of SLA while Customer care retains communication
        ownership.
      </div>
    </div>
  );
}
function Outcome(): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="resolution-outcome-verification">
      <section className={s.panel}>
        <div className={s.score}>84</div>
        <h3>Resolution confidence</h3>
        <p className={s.meta}>Customer confirmation is still required from 3 stores.</p>
      </section>
      <section className={s.panel}>
        {[
          ["SLA", "Inside target by 38m"],
          ["Stores verified", "39 of 42"],
          ["Reopen risk", "12%"],
          ["Recovery cost", "€4,200"],
          ["Next check", "Tomorrow 09:00"],
        ].map((item) => (
          <div className={s.row} key={item[0]}>
            <CheckmarkCircle20Filled />
            <span>{item[0]}</span>
            <b>{item[1]}</b>
          </div>
        ))}
      </section>
    </div>
  );
}
function Commitments(props: { readonly d: IServiceIntentDefinition; readonly user: string }): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="commitment-bilateral-promise-ledger">
      <section className={s.panel}>
        {serviceData.getAggregate().commitments.map((item) => (
          <div className={s.row} key={item.id}>
            {item.status === "at-risk" ? <Warning20Filled /> : <CheckmarkCircle20Filled />}
            <span>
              <b>{item.label}</b>
              <br />
              <span className={s.meta}>
                {item.party} · {item.owner}
              </span>
            </span>
            <Badge color={item.status === "at-risk" ? "warning" : "success"}>{item.dueOffsetMinutes}m</Badge>
          </div>
        ))}
      </section>
      <OperationFlow
        definition={props.d}
        user={props.user}
        initial="Renegotiate the launch readiness decision to follow verification from all 42 stores."
        reviewLabel="Promise decision"
        consequence="Changes a customer-visible commitment and requires an accountable owner."
        confirmLabel="Confirm commitment decision"
      />
    </div>
  );
}
function Quality(props: { readonly d: IServiceIntentDefinition; readonly user: string }): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="service-quality-transparent-scorecard">
      <section className={s.panel}>
        {[
          ["Resolution correctness", 92],
          ["Communication", 84],
          ["Customer effort", 76],
          ["Knowledge use", 89],
        ].map((item) => (
          <div className={s.row} key={String(item[0])}>
            <span>{item[0]}</span>
            <ProgressBar value={Number(item[1]) / 100} />
            <b>{item[1]}</b>
          </div>
        ))}
      </section>
      <OperationFlow
        definition={props.d}
        user={props.user}
        initial="Record targeted coaching on customer effort while recognizing correct diagnostic challenge."
        reviewLabel="Quality finding"
        consequence="Creates a transparent coaching record with named evidence, not an opaque AI score."
        confirmLabel="Record quality outcome"
      />
    </div>
  );
}
function FieldService(props: { readonly d: IServiceIntentDefinition; readonly user: string }): React.ReactElement {
  const s = useStyles();
  return (
    <div className={s.split} data-layout="field-service-readiness-planner">
      <section className={s.panel}>
        <h3 className={s.title}>Three stores failed rollback</h3>
        {[
          ["Paris Rivoli", "Nestor Wilke", "Part kit ready"],
          ["Lyon Centre", "Nestor Wilke", "Window 16:30"],
          ["Brussels Nord", "Field partner", "Awaiting access"],
        ].map((item) => (
          <div className={s.row} key={item[0]}>
            <span className={s.status} />
            <span>
              <b>{item[0]}</b>
              <br />
              <span className={s.meta}>{item[1]}</span>
            </span>
            <Badge>{item[2]}</Badge>
          </div>
        ))}
      </section>
      <OperationFlow
        definition={props.d}
        user={props.user}
        initial="Dispatch the Paris and Lyon visits today; hold Brussels until customer access is confirmed."
        reviewLabel="Dispatch plan"
        consequence="Reserves technician, parts, and customer windows in this demo session."
        confirmLabel="Create mock dispatch"
      />
    </div>
  );
}
function Explorer(props: {
  readonly initialQuery?: string;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const pageSize = 7;
  const [query, setQuery] = React.useState(props.initialQuery || "");
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState(INTENTS[0]);
  const results = INTENTS.filter(
    (item) =>
      item.operation !== "education" && `${item.title} ${item.role} ${item.outcome}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visible = results.slice(safePage * pageSize, (safePage + 1) * pageSize);
  React.useEffect(() => {
    setPage(0);
  }, [query]);
  React.useEffect(() => {
    props.onVisibleStateChange?.({
      selectedId: selected.key,
      query,
      view: "detail",
      summary: `Explore agent capabilities is showing ${selected.title}; page ${safePage + 1} of ${pageCount} exposes scenarios ${results.length ? `${safePage * pageSize + 1}-${Math.min((safePage + 1) * pageSize, results.length)}` : "0"} of ${results.length}${query ? ` matching ${query}` : ""}.`,
    });
  }, [pageCount, props.onVisibleStateChange, query, results.length, safePage, selected.key, selected.title]);
  return (
    <div className={s.explorer} data-layout="capability-explorer-scenario-gallery">
      <section className={s.panel}>
        <Field label="What are you trying to accomplish?">
          <Input value={query} onChange={(_, data) => setQuery(data.value)} placeholder="Search outcomes, roles, or work areas" />
        </Field>
        {results.length ? (
          <>
            {visible.map((item) => (
              <button className={s.scenario} key={item.key} onClick={() => setSelected(item)}>
                <span>
                  <b>{item.title}</b>
                  <br />
                  <span className={s.meta}>
                    {LENS_LABELS[item.lens]} · {item.outcome}
                  </span>
                </span>
                <ArrowRight20Regular />
              </button>
            ))}
            <div className={s.pager}>
              <span className={s.meta}>
                Showing {safePage * pageSize + 1}-{Math.min((safePage + 1) * pageSize, results.length)} of {results.length}{" "}
                scenarios · Page {safePage + 1} of {pageCount}
              </span>
              <div className={s.pagerActions}>
                <Button size="small" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
                  Previous
                </Button>
                <Button
                  size="small"
                  disabled={safePage >= pageCount - 1}
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className={s.empty}>
            <DismissCircle20Regular className={s.emptyIcon} />
            <b>No matching capabilities</b>
            <span>Try a role, outcome, or work area, or browse the complete catalog.</span>
            <Button appearance="subtle" onClick={() => setQuery("")}>
              View all capabilities
            </Button>
          </div>
        )}
      </section>
      <aside className={`${s.panel} ${s.soft}`}>
        <Badge>Safe preview</Badge>
        <h3>{selected.title}</h3>
        <p>{selected.decisionQuestion}</p>
        <p className={s.message}>{selected.prompt}</p>
        <Button onClick={() => navigator.clipboard?.writeText(selected.prompt)}>Copy prompt</Button>
        <p className={s.meta}>Demo preview - no action applied</p>
      </aside>
    </div>
  );
}

function ExperienceBody(props: {
  readonly definition: IServiceIntentDefinition;
  readonly properties: IServiceProperties;
  readonly user: string;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const s = useStyles();
  const { definition: d, properties: p, user } = props;
  switch (d.key) {
    case "TriageCustomerIssue":
      return <Triage d={d} p={p} user={user} onVisibleStateChange={props.onVisibleStateChange} />;
    case "GetPriorityServiceQueue":
      return (
        <div data-layout="priority-queue-ranked-judgment">
          <PriorityQueue />
        </div>
      );
    case "ExploreCustomerHealth":
      return <CustomerHealth customerId={p.customerId} />;
    case "BuildResolutionPlan":
      return (
        <div className={s.split} data-layout="resolution-plan-evidence-path">
          <EvidenceLedger />
          <ResolutionSteps />
        </div>
      );
    case "StartExpertSwarm":
      return (
        <div data-layout="expert-swarm-skill-availability">
          <ExpertList />
          <OperationFlow
            definition={d}
            user={user}
            initial="Ask whether rollback 8.4.11 is safe across all 42 stores; include telemetry and contrary network evidence."
            reviewLabel="Decision question and evidence scope"
            consequence="Shares only reviewed evidence with three named specialists."
            confirmLabel="Start mock swarm"
          />
        </div>
      );
    case "DetectServiceIncident":
      return (
        <IncidentDetection initialThreshold={p.similarityThreshold || 72} onVisibleStateChange={props.onVisibleStateChange} />
      );
    case "ReviewIncidentResponse":
      return <FlagshipReview kind="incident" definition={d} user={user} onVisibleStateChange={props.onVisibleStateChange} />;
    case "ReviewServiceRecovery":
      return (
        <FlagshipReview
          kind="recovery"
          definition={d}
          user={user}
          amount={p.amount}
          onVisibleStateChange={props.onVisibleStateChange}
        />
      );
    case "ComposeCustomerUpdate":
      return <CustomerUpdate d={d} p={p} user={user} onVisibleStateChange={props.onVisibleStateChange} />;
    case "TrackResolutionOutcome":
      return <Outcome />;
    case "CreateKnowledgeFromResolution":
      return (
        <div className={s.split} data-layout="knowledge-applicability-canvas">
          <EvidenceLedger />
          <OperationFlow
            definition={d}
            user={user}
            initial="Activation failure on Zava Handheld 8.4.12: verify network health, roll back to 8.4.11, then validate staged cohorts. Exclude other versions."
            reviewLabel="Knowledge applicability and exclusions"
            consequence="Creates a draft article from verified resolution evidence; it does not publish."
            confirmLabel="Create knowledge draft"
          />
        </div>
      );
    case "ExploreServicePerformance":
      return (
        <div data-layout="service-performance-demand-river">
          <DemandResolutionRiver
            onScopeChange={(period, summary) =>
              props.onVisibleStateChange?.({
                view: "detail",
                query: period,
                summary: `Explore service performance is showing ${summary}`,
              })
            }
          />
        </div>
      );
    case "ExploreRegionalServiceImpact":
      return (
        <div data-layout="regional-service-impact-map">
          <GlobalServiceMap />
        </div>
      );
    case "ExploreRecurringServiceDrivers":
      return (
        <div data-layout="recurring-service-driver-pareto">
          <RecurringDriverPareto />
        </div>
      );
    case "DiagnoseCaseEvidence":
      return <Diagnostics />;
    case "ReviewEntitlementCoverage":
      return <Entitlement />;
    case "ManageCaseEscalation":
      return (
        <div className={s.split} data-layout="case-escalation-capacity-review">
          <Workload />
          <OperationFlow
            definition={d}
            user={user}
            initial="Escalate technical ownership to Pradeep; retain Amina as customer owner; acceptance due in 20 minutes."
            reviewLabel="Escalation package"
            consequence="Protects 42 minutes of SLA and requires explicit target-team acceptance."
            confirmLabel="Confirm mock escalation"
          />
        </div>
      );
    case "BalanceServiceWorkload":
      return <Workload />;
    case "CoordinateFieldService":
      return <FieldService d={d} user={user} />;
    case "ManageCustomerCommitments":
      return <Commitments d={d} user={user} />;
    case "RunServiceQualityReview":
      return <Quality d={d} user={user} />;
    case "PlanCustomerWinBack":
      return (
        <div data-layout="winback-trust-recovery-plan">
          <CustomerPromiseConstellation />
          <OperationFlow
            definition={d}
            user={user}
            initial="Resolve the launch harm, complete every open promise, provide executive sponsorship, and verify adoption after 30 days."
            reviewLabel="Trust recovery plan"
            consequence="Coordinates service and relationship owners; it does not initiate outreach."
            confirmLabel="Create win-back plan"
          />
        </div>
      );
    case "ExploreAgentCapabilities":
      return <Explorer initialQuery={p.query} onVisibleStateChange={props.onVisibleStateChange} />;
  }
}

export default function ServiceInlineExperience(props: {
  readonly definition: IServiceIntentDefinition;
  readonly properties: IServiceProperties;
  readonly user: string;
  readonly onVisibleStateChange?: (state: IVisibleInlineState) => void;
}): React.ReactElement {
  const hasSpecializedState =
    caseScoped(props.definition) ||
    props.definition.key === "TriageCustomerIssue" ||
    props.definition.key === "DetectServiceIncident" ||
    props.definition.key === "ExploreServicePerformance" ||
    props.definition.key === "ExploreAgentCapabilities";
  React.useEffect(() => {
    if (!hasSpecializedState) props.onVisibleStateChange?.(visibleStateFor(props.definition, props.properties));
  }, [
    hasSpecializedState,
    props.definition,
    props.onVisibleStateChange,
    props.properties.customerId,
    props.properties.query,
    props.properties.selectedId,
  ]);
  const body = (
    <ExperienceBody
      definition={props.definition}
      properties={props.properties}
      user={props.user}
      onVisibleStateChange={props.onVisibleStateChange}
    />
  );
  if (
    !caseScoped(props.definition) ||
    props.definition.key === "ComposeCustomerUpdate" ||
    props.definition.key === "ReviewIncidentResponse" ||
    props.definition.key === "ReviewServiceRecovery"
  )
    return body;
  return (
    <CaseReviewScope
      definition={props.definition}
      properties={props.properties}
      onVisibleStateChange={props.onVisibleStateChange}
    >
      {body}
    </CaseReviewScope>
  );
}
