import * as React from 'react';
import { Button, Checkbox, Dropdown, Field, Input, Option, Textarea } from '@fluentui/react-components';
import { CheckmarkCircle24Filled, Dismiss24Regular, Send24Regular } from '@fluentui/react-icons';

import { MOCK_GRAPH } from '../data/mockData';
import type { IIntentDefinition } from '../intents/intentCatalog';
import type { OperationAction } from '../operations/operationState';

import styles from './IntentCanvasApp.module.scss';

interface ISubmitOperationFieldsProps {
  readonly isDark: boolean;
  readonly intent: IIntentDefinition;
  readonly properties: Readonly<Record<string, unknown>>;
  readonly onReview: (summary: string) => void;
}

interface IReviewOperationFieldsProps {
  readonly isDark: boolean;
  readonly intent: IIntentDefinition;
  readonly onChoose: (action: OperationAction, summary: string) => void;
}

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const ISSUE_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

function initialStringProperty(properties: Readonly<Record<string, unknown>>, name: string): string {
  return typeof properties[name] === 'string' ? properties[name].trim() : '';
}

function initialSeverity(properties: Readonly<Record<string, unknown>>): string {
  const providedSeverity = initialStringProperty(properties, 'severity');
  return ISSUE_SEVERITIES.find((severity) => severity.toLowerCase() === providedSeverity.toLowerCase()) ?? 'Medium';
}

function FieldSummary(props: { readonly label: string; readonly value: string; readonly detail: string }): React.ReactElement {
  return <div className={styles.operationSummary}><span>{props.label}</span><strong>{props.value}</strong><small>{props.detail}</small></div>;
}

function EvidenceChoice(props: { readonly checked: boolean; readonly label: string; readonly onChange: (checked: boolean) => void }): React.ReactElement {
  return (
    <Checkbox
      checked={props.checked}
      className={`${styles.evidenceChoice} ${props.checked ? styles.evidenceChoiceSelected : ''}`}
      indicator={{ className: styles.evidenceChoiceIndicator }}
      label={{ children: props.label, className: styles.evidenceChoiceLabel }}
      size="large"
      onChange={(_event, data) => props.onChange(data.checked === true)}
    />
  );
}

export function SubmitOperationFields(props: ISubmitOperationFieldsProps): React.ReactElement {
  const [selectedModelId, setSelectedModelId] = React.useState('surface-laptop-138');
  const [memoryGb, setMemoryGb] = React.useState(32);
  const [storageGb, setStorageGb] = React.useState(512);
  const [includeDock, setIncludeDock] = React.useState(true);
  const [businessOutcome, setBusinessOutcome] = React.useState('Customer workshops');
  const [evidenceIds, setEvidenceIds] = React.useState<readonly string[]>(['battery', 'age', 'policy']);
  const [issueCategory, setIssueCategory] = React.useState('Collaboration');
  const [severity, setSeverity] = React.useState(() => initialSeverity(props.properties));
  const [symptom, setSymptom] = React.useState(() => initialStringProperty(props.properties, 'symptom'));
  const [attachDiagnostics, setAttachDiagnostics] = React.useState(true);
  const [delegateId, setDelegateId] = React.useState('alex');
  const [delegationScope, setDelegationScope] = React.useState('Device approvals');
  const [coverageWindow, setCoverageWindow] = React.useState('Aug 24-28, 2026');
  const [rationale, setRationale] = React.useState('');
  const selectedSku = MOCK_GRAPH.surfaceCatalog.find((sku) => sku.id === selectedModelId) ?? MOCK_GRAPH.surfaceCatalog[0];
  const configuredPrice = selectedSku.price
    + Math.max(0, memoryGb - (selectedSku.memoryGb ?? memoryGb)) * 12
    + Math.max(0, storageGb - (selectedSku.storageGb ?? storageGb)) * 0.35
    + (includeDock ? 199 : 0);

  const toggleEvidence = (id: string, checked: boolean): void => {
    setEvidenceIds((current) => checked ? [...current, id] : current.filter((entry) => entry !== id));
  };

  if (props.intent.name === 'ConfigureDeviceRequest') {
    const summary = `${selectedSku.name}, ${memoryGb} GB memory, ${storageGb} GB storage${includeDock ? ', Surface USB4 Dock' : ''}, ${money(configuredPrice)}. ${rationale}`;
    return (
      <section className={styles.operationForm} aria-label="Configure a request form">
        <div className={styles.operationFieldGrid}>
          <Field className={styles.formField} label="Surface model" required><FormDropdown ariaLabel="Surface model" isDark={props.isDark} value={selectedModelId} onChange={setSelectedModelId} options={MOCK_GRAPH.surfaceCatalog.filter((sku) => sku.category === 'device').map((sku) => ({ value: sku.id, label: sku.name, selectedLabel: sku.name.replace(', Copilot+ PC,', '') }))} /></Field>
          <Field className={styles.formField} label="Memory" required><FormDropdown ariaLabel="Memory" isDark={props.isDark} value={String(memoryGb)} onChange={(value) => setMemoryGb(Number(value))} options={[{ value: '16', label: '16 GB' }, { value: '32', label: '32 GB' }, { value: '64', label: '64 GB' }]} /></Field>
          <Field className={styles.formField} label="Storage" required><FormDropdown ariaLabel="Storage" isDark={props.isDark} value={String(storageGb)} onChange={(value) => setStorageGb(Number(value))} options={[{ value: '256', label: '256 GB' }, { value: '512', label: '512 GB' }, { value: '1024', label: '1 TB' }]} /></Field>
        </div>
        <div className={styles.optionRow}>
          <Checkbox className={styles.optionCheckbox} checked={includeDock} label="Include Surface USB4 Dock" onChange={(_event, data) => setIncludeDock(data.checked === true)} />
          <span className={styles.optionPrice}>+$199</span>
        </div>
        <FieldSummary label="Configured estimate" value={money(configuredPrice)} detail={memoryGb >= 32 ? 'Within Product role policy' : 'Memory is below the recommended Product profile'} />
        <Field className={styles.formField} hint="Explain the business outcome this device enables." label="Business rationale" required><Textarea className={styles.editableControl} id="zava-config-rationale" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
        <Button appearance="primary" className={styles.primaryAction} disabled={rationale.trim().length === 0} icon={<Send24Regular />} onClick={() => props.onReview(summary)}>Review configuration</Button>
      </section>
    );
  }

  if (props.intent.name === 'DraftDeviceJustification') {
    const summary = `${businessOutcome}. Evidence: ${evidenceIds.join(', ')}. ${rationale}`;
    return (
      <section className={styles.operationForm} aria-label="Draft justification form">
        <Field className={styles.formField} label="Business outcome" required><FormDropdown ariaLabel="Business outcome" isDark={props.isDark} value={businessOutcome} onChange={setBusinessOutcome} options={['Customer workshops', 'Field productivity', 'Design workload', 'Accessibility accommodation'].map((value) => ({ value, label: value }))} /></Field>
        <fieldset className={styles.evidenceChoices}>
          <legend>Evidence to include</legend>
          <div className={styles.evidenceGrid}>
            <EvidenceChoice checked={evidenceIds.indexOf('battery') >= 0} label="Battery health: 62%" onChange={(checked) => toggleEvidence('battery', checked)} />
            <EvidenceChoice checked={evidenceIds.indexOf('age') >= 0} label="Device age: 42 months" onChange={(checked) => toggleEvidence('age', checked)} />
            <EvidenceChoice checked={evidenceIds.indexOf('policy') >= 0} label="Standard policy path" onChange={(checked) => toggleEvidence('policy', checked)} />
            <EvidenceChoice checked={evidenceIds.indexOf('calendar') >= 0} label="Four upcoming workshops" onChange={(checked) => toggleEvidence('calendar', checked)} />
          </div>
        </fieldset>
        <Field className={styles.formField} hint="Use the selected evidence to explain why the request is necessary." label="Editable justification" required><Textarea className={styles.editableControl} id="zava-justification" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
        <Button appearance="primary" className={styles.primaryAction} disabled={rationale.trim().length === 0 || evidenceIds.length < 2} icon={<Send24Regular />} onClick={() => props.onReview(summary)}>Review justification</Button>
      </section>
    );
  }

  if (props.intent.name === 'ReportItIssue') {
    const summary = `${severity} ${issueCategory.toLowerCase()} issue on ZVA-SRF-1042: ${symptom}. Impact: ${rationale}${attachDiagnostics ? ' Safe diagnostics attached.' : ''}`;
    return (
      <section className={styles.operationForm} aria-label="Report an IT issue form">
        <div className={styles.operationFieldGrid}>
          <Field className={styles.formField} label="Category" required><FormDropdown ariaLabel="Issue category" isDark={props.isDark} value={issueCategory} onChange={setIssueCategory} options={['Collaboration', 'Hardware', 'Connectivity', 'Access and identity', 'Software'].map((value) => ({ value, label: value }))} /></Field>
          <Field className={styles.formField} label="Severity" required><FormDropdown ariaLabel="Issue severity" isDark={props.isDark} value={severity} onChange={setSeverity} options={ISSUE_SEVERITIES.map((value) => ({ value, label: value }))} /></Field>
        </div>
        <Field className={styles.formField} hint="Describe the symptom in your own words." label="What is happening?" required><Input className={styles.editableControl} size="large" id="zava-symptom" value={symptom} placeholder="Calls drop when the Surface is undocked" onChange={(_event, data) => setSymptom(data.value)} /></Field>
        <Field className={styles.formField} hint="Include who is affected, any workaround, and what you already tried." label="Business impact and troubleshooting tried" required><Textarea className={styles.editableControl} id="zava-issue-impact" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
        <FieldSummary label="Detected device" value="ZVA-SRF-1042" detail="Surface Laptop 13.8-inch / compliant / last seen today" />
        <div className={`${styles.optionRow} ${styles.diagnosticsOptionRow}`}>
          <Checkbox className={styles.optionCheckbox} checked={attachDiagnostics} label="Attach safe device diagnostics (no personal files)" onChange={(_event, data) => setAttachDiagnostics(data.checked === true)} />
        </div>
        <Button appearance="primary" className={styles.primaryAction} disabled={symptom.trim().length === 0 || rationale.trim().length === 0} icon={<Send24Regular />} onClick={() => props.onReview(summary)}>Review issue report</Button>
      </section>
    );
  }

  const delegateName = delegateId === 'alex' ? 'Alex Wilber' : delegateId === 'lee' ? 'Lee Gu' : 'Adele Vance';
  const summary = `${delegationScope} delegated to ${delegateName} for ${coverageWindow}. ${rationale}`;
  return (
    <section className={styles.operationForm} aria-label="Delegate approval form">
      <div className={styles.operationFieldGrid}>
        <Field className={styles.formField} label="Eligible delegate" required><FormDropdown ariaLabel="Eligible delegate" isDark={props.isDark} value={delegateId} onChange={setDelegateId} options={[{ value: 'alex', label: 'Alex Wilber - Senior Manager', selectedLabel: 'Alex Wilber' }, { value: 'lee', label: 'Lee Gu - IT Operations Lead', selectedLabel: 'Lee Gu' }, { value: 'adele', label: 'Adele Vance - Product Designer', selectedLabel: 'Adele Vance' }]} /></Field>
        <Field className={styles.formField} label="Scope" required><FormDropdown ariaLabel="Delegation scope" isDark={props.isDark} value={delegationScope} onChange={setDelegationScope} options={['Device approvals', 'All Product approvals', 'Policy exceptions only'].map((value) => ({ value, label: value }))} /></Field>
      </div>
      <Field className={styles.formField} hint="Use a clear date range, for example Aug 24-28, 2026." label="Coverage window" required><Input className={styles.editableControl} size="large" id="zava-coverage-window" value={coverageWindow} onChange={(_event, data) => setCoverageWindow(data.value)} /></Field>
      <FieldSummary label="Eligibility check" value={delegateId === 'alex' ? 'Eligible' : 'Review required'} detail={delegateId === 'alex' ? 'Matching role; no selected-request conflict' : 'Role or approval-chain conflict needs review'} />
      <Field className={styles.formField} hint="Explain why the delegation is needed and any safeguards." label="Delegation rationale" required><Textarea className={styles.editableControl} id="zava-delegation-rationale" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
      <Button appearance="primary" className={styles.primaryAction} disabled={coverageWindow.trim().length === 0 || rationale.trim().length === 0} icon={<Send24Regular />} onClick={() => props.onReview(summary)}>Review delegation</Button>
    </section>
  );
}

export function ReviewOperationFields(props: IReviewOperationFieldsProps): React.ReactElement {
  const [rationale, setRationale] = React.useState('');
  const [approvalCondition, setApprovalCondition] = React.useState('Standard approval');
  const [exceptionResolution, setExceptionResolution] = React.useState('Approve with director safeguard');
  const canDecide = rationale.trim().length > 0;

  if (props.intent.name === 'ReviewPolicyException') {
    const summary = `${exceptionResolution}. Variance is 18% above the role threshold. ${rationale}`;
    return (
      <section className={styles.operationForm} aria-label="Policy exception decision">
        <Field className={styles.formField} label="Resolution" required><FormDropdown ariaLabel="Exception resolution" isDark={props.isDark} value={exceptionResolution} onChange={setExceptionResolution} options={['Approve with director safeguard', 'Use standard Surface Laptop alternative', 'Return for more evidence'].map((value) => ({ value, label: value }))} /></Field>
        <FieldSummary label="Policy variance" value="18% above threshold" detail="Surface Laptop 15-inch meets the evidenced workload at $300 lower cost." />
        <Field className={styles.formField} hint="Document the exception evidence and required safeguards." label="Exception rationale and safeguards" required><Textarea className={styles.editableControl} id="zava-exception-rationale" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
        <div className={styles.actionRow}><Button appearance="primary" className={`${styles.actionButton} ${styles.actionButtonPrimary}`} disabled={!canDecide} icon={<CheckmarkCircle24Filled />} onClick={() => props.onChoose(exceptionResolution.indexOf('standard') >= 0 ? 'use-alternative' : 'approve', summary)}>Apply resolution</Button><Button className={styles.actionButton} disabled={!canDecide} icon={<Dismiss24Regular />} onClick={() => props.onChoose('decline', summary)}>Decline exception</Button></div>
      </section>
    );
  }

  const summary = `${approvalCondition}. Budget after approval is $30,221. ${rationale}`;
  return (
    <section className={styles.operationForm} aria-label="Device approval decision">
      <Field className={styles.formField} label="Approval condition" required><FormDropdown ariaLabel="Approval condition" isDark={props.isDark} value={approvalCondition} onChange={setApprovalCondition} options={['Standard approval', 'Approve after old device return', 'Charge alternate cost center'].map((value) => ({ value, label: value }))} /></Field>
      <FieldSummary label="Budget after approval" value="$30,221" detail="31% remains / standard configuration / no exception" />
      <Field className={styles.formField} hint="Explain the evidence and consequence behind this decision." label="Decision rationale" required><Textarea className={styles.editableControl} id="zava-approval-rationale" resize="vertical" value={rationale} onChange={(_event, data) => setRationale(data.value)} /></Field>
      <div className={styles.actionRow}><Button appearance="primary" className={`${styles.actionButton} ${styles.actionButtonPrimary}`} disabled={!canDecide} icon={<CheckmarkCircle24Filled />} onClick={() => props.onChoose('approve', summary)}>Approve request</Button><Button className={styles.actionButton} disabled={!canDecide} icon={<Dismiss24Regular />} onClick={() => props.onChoose('decline', summary)}>Reject request</Button></div>
    </section>
  );
}

interface IFormOption {
  readonly value: string;
  readonly label: string;
  readonly selectedLabel?: string;
}

export function FormDropdown(props: { readonly ariaLabel: string; readonly isDark: boolean; readonly value: string; readonly options: readonly IFormOption[]; readonly onChange: (value: string) => void }): React.ReactElement {
  const selectedOption = props.options.find((option) => option.value === props.value);
  const selectedLabel = selectedOption?.selectedLabel ?? selectedOption?.label ?? props.value;
  return (
    <Dropdown
      aria-label={props.ariaLabel}
      className={styles.formDropdown}
      button={{ className: styles.formDropdownButton }}
      expandIcon={{ className: styles.formDropdownIcon }}
      listbox={{ className: `${styles.formDropdownListbox} ${props.isDark ? styles.formDropdownListboxDark : ''}` }}
      onOptionSelect={(_event, data) => data.optionValue && props.onChange(data.optionValue)}
      positioning={{ matchTargetSize: 'width' }}
      selectedOptions={[props.value]}
      size="large"
      value={selectedLabel}
    >
      {props.options.map((option) => <Option key={option.value} text={option.label} value={option.value}>{option.label}</Option>)}
    </Dropdown>
  );
}