import * as React from 'react';

export interface IAsyncResource<TData> {
  data?: TData;
  error?: unknown;
  isLoading: boolean;
  reload: () => void;
}

interface IAsyncState<TData> {
  data?: TData;
  error?: unknown;
  isLoading: boolean;
}

/**
 * Runs `load` whenever `key` changes and discards results that arrive after the
 * key changed or the component unmounted. Pass `undefined` as the key to skip loading.
 */
export function useAsyncResource<TData>(load: () => Promise<TData>, key: string | undefined): IAsyncResource<TData> {
  const [state, setState] = React.useState<IAsyncState<TData>>({ isLoading: key !== undefined });
  const [reloadToken, setReloadToken] = React.useState(0);

  const loadRef = React.useRef(load);
  loadRef.current = load;

  const effectiveKey = React.useMemo(() => (key === undefined ? undefined : `${key}:${reloadToken}`), [key, reloadToken]);

  React.useEffect(() => {
    if (effectiveKey === undefined) {
      setState({ isLoading: false });
      return undefined;
    }

    let isActive = true;
    setState({ isLoading: true, error: undefined });

    loadRef.current().then(
      (data) => {
        if (isActive) {
          setState({ data, isLoading: false });
        }
      },
      (error: unknown) => {
        if (isActive) {
          setState({ error, isLoading: false });
        }
      }
    );

    return () => {
      isActive = false;
    };
  }, [effectiveKey]);

  const reload = React.useCallback(() => {
    setState((previous) => ({ ...previous, isLoading: true, error: undefined }));
    setReloadToken((token) => token + 1);
  }, []);

  return { ...state, reload };
}
