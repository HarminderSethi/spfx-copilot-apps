import * as React from 'react';
import {
  Avatar,
  Combobox,
  Option,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { IPerson } from './models/kudos.types';
import type { IPeopleService } from './services/IPeopleService';

const SEARCH_DEBOUNCE_MS = 300;

const useStyles = makeStyles({
  option: { display: 'flex', alignItems: 'center', columnGap: '8px' },
  status: {
    padding: '8px 12px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

export interface IRecipientPickerProps {
  peopleService: IPeopleService;
  onPick: (person: IPerson) => void;
  placeholder?: string;
}

/**
 * Type-ahead colleague search backed by IPeopleService (Microsoft Graph in
 * production, the mock roster in the workbench). Resolves a full IPerson so the
 * caller can write the Person field and render the avatar.
 */
export const RecipientPicker: React.FC<IRecipientPickerProps> = ({
  peopleService,
  onPick,
  placeholder = 'Search for a colleague',
}) => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<IPerson[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const handle = setTimeout(() => {
      setLoading(true);
      peopleService
        .searchPeople(query)
        .then((people) => {
          if (active) setResults(people);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query, peopleService]);

  return (
    <Combobox
      freeform
      placeholder={placeholder}
      onChange={(event) => setQuery(event.target.value)}
      onOptionSelect={(_, data) => {
        const person = results.find((p) => p.id === data.optionValue);
        if (person) onPick(person);
      }}
    >
      {loading && (
        <div className={styles.status}>
          <Spinner size="tiny" label="Searching…" />
        </div>
      )}
      {!loading && results.length === 0 && (
        <div className={styles.status}>No colleagues found.</div>
      )}
      {results.map((person) => (
        <Option key={person.id} value={person.id} text={person.displayName}>
          <span className={styles.option}>
            <Avatar
              size={24}
              name={person.displayName}
              image={person.photoUrl ? { src: person.photoUrl } : undefined}
            />
            {person.displayName}
          </span>
        </Option>
      ))}
    </Combobox>
  );
};
