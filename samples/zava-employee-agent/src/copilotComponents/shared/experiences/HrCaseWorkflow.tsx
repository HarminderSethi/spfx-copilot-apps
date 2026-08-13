import * as React from 'react';

import { Text } from '@fluentui/react-text';
import { makeStyles } from '@griffel/react';
import { tokens } from '@fluentui/react-theme';
import { ArrowLeft20Regular, CheckmarkCircle20Filled, Send20Regular, ShieldLock20Regular } from '@fluentui/react-icons';

type CaseStage = 'edit' | 'review' | 'opened';

const useStyles = makeStyles({
  stack: { display: 'flex', flexDirection: 'column', gap: '12px' },
  privacy: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteCranberryForeground2, backgroundColor: tokens.colorPaletteCranberryBackground2, borderRadius: tokens.borderRadiusMedium },
  form: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', '@media (max-width: 460px)': { gridTemplateColumns: '1fr' } },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  span: { gridColumn: '1 / -1' },
  input: { minWidth: 0, padding: '8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  answer: { display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: '8px', padding: '10px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, borderRadius: tokens.borderRadiusMedium },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } },
  summaryItem: { padding: '10px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: tokens.borderRadiusMedium },
  label: { color: tokens.colorNeutralForeground3 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  primary: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', color: tokens.colorNeutralForegroundOnBrand, backgroundColor: tokens.colorBrandBackground, border: 'none', borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  secondary: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', color: tokens.colorNeutralForeground2, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', fontWeight: tokens.fontWeightSemibold },
  success: { display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr)', gap: '10px', padding: '14px', color: tokens.colorPaletteGreenForeground1, backgroundColor: tokens.colorPaletteGreenBackground2, border: `1px solid ${tokens.colorPaletteGreenBorderActive}`, borderRadius: tokens.borderRadiusMedium },
  successIcon: { fontSize: '28px' },
  disclosure: { color: tokens.colorNeutralForeground3 }
});

export interface IHrCaseWorkflowProps {
  params: Record<string, string | number | boolean | string[]>;
}

const HrCaseWorkflow: React.FunctionComponent<IHrCaseWorkflowProps> = ({ params }) => {
  const styles = useStyles();
  const promptCategory = String(params.category || 'payroll');
  const promptPrivacy = String(params.privacyLevel || 'private');
  const promptSubject = String(params.subject || 'Unexplained payroll deduction');
  const promptDescription = String(params.description || 'Please help me understand a deduction on my latest statement.');
  const [stage, setStage] = React.useState<CaseStage>('edit');
  const [category, setCategory] = React.useState(promptCategory);
  const [privacy, setPrivacy] = React.useState(promptPrivacy);
  const [subject, setSubject] = React.useState(promptSubject);
  const [description, setDescription] = React.useState(promptDescription);

  React.useEffect(() => {
    setCategory(promptCategory);
    setPrivacy(promptPrivacy);
    setSubject(promptSubject);
    setDescription(promptDescription);
    setStage('edit');
  }, [promptCategory, promptPrivacy, promptSubject, promptDescription]);

  if (stage === 'opened') {
    return <div className={styles.stack} role="status" aria-live="polite"><div className={styles.success}><CheckmarkCircle20Filled className={styles.successIcon} /><span><Text size={400} block weight="semibold">Private HR case opened</Text><Text size={200} block>Case HR-2049 is now in the mocked HR queue. The first-response target is four business hours.</Text></span></div><div className={styles.summary}><div className={styles.summaryItem}><Text size={100} block className={styles.label}>Case</Text><Text weight="semibold">HR-2049</Text></div><div className={styles.summaryItem}><Text size={100} block className={styles.label}>Privacy</Text><Text weight="semibold">{privacy}</Text></div><div className={`${styles.summaryItem} ${styles.span}`}><Text size={100} block className={styles.label}>Subject</Text><Text weight="semibold">{subject}</Text></div></div><Text size={200} className={styles.disclosure}>Showcase only: no case was created in a live HR system.</Text></div>;
  }

  if (stage === 'review') {
    return <div className={styles.stack}><Text size={500} weight="semibold">Review your private HR case</Text><div className={styles.privacy}><ShieldLock20Regular /><span><Text block weight="semibold">Only the assigned HR case team receives these details</Text><Text size={200}>The description will not appear in Home summaries or shared agent responses.</Text></span></div><div className={styles.summary}><div className={styles.summaryItem}><Text size={100} block className={styles.label}>Category</Text><Text weight="semibold">{category}</Text></div><div className={styles.summaryItem}><Text size={100} block className={styles.label}>Privacy</Text><Text weight="semibold">{privacy}</Text></div><div className={`${styles.summaryItem} ${styles.span}`}><Text size={100} block className={styles.label}>Subject</Text><Text weight="semibold">{subject}</Text></div><div className={`${styles.summaryItem} ${styles.span}`}><Text size={100} block className={styles.label}>Details for HR</Text><Text>{description || 'No additional details provided'}</Text></div></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setStage('edit')}><ArrowLeft20Regular /> Edit case</button><button type="button" className={styles.primary} onClick={() => setStage('opened')}><Send20Regular /> Open case with HR</button></div></div>;
  }

  return <div className={styles.stack}><div className={styles.privacy}><ShieldLock20Regular /><span><Text block weight="semibold">Private HR workspace</Text><Text size={200}>Your description is visible only to the assigned HR case team and is not repeated in Home summaries.</Text></span></div><div className={styles.form}><label className={styles.field}><Text size={200}>Category</Text><select aria-label="Case category" className={styles.input} value={category} onChange={(event) => setCategory(event.currentTarget.value)}><option value="payroll">Payroll</option><option value="benefits">Benefits</option><option value="leave">Leave</option><option value="workplace">Workplace</option><option value="learning">Learning</option><option value="other">Other</option></select></label><label className={styles.field}><Text size={200}>Privacy</Text><select aria-label="Case privacy" className={styles.input} value={privacy} onChange={(event) => setPrivacy(event.currentTarget.value)}><option value="standard">Standard</option><option value="private">Private</option><option value="sensitive">Sensitive</option></select></label><label className={`${styles.field} ${styles.span}`}><Text size={200}>Subject</Text><input aria-label="Case subject" className={styles.input} value={subject} onChange={(event) => setSubject(event.currentTarget.value)} /></label><label className={`${styles.field} ${styles.span}`}><Text size={200}>Details for HR</Text><textarea aria-label="Case details" className={styles.input} rows={3} value={description} onChange={(event) => setDescription(event.currentTarget.value)} /></label></div><div className={styles.answer}><CheckmarkCircle20Filled /><span><Text block weight="semibold">Possible answer found</Text><Text size={200}>The latest adjustment may explain this deduction. You can still continue to a private case.</Text></span></div><button type="button" className={styles.primary} onClick={() => setStage('review')}>Review private case</button></div>;
};

export default HrCaseWorkflow;