import {useCallback, useEffect, useRef, useState} from 'react';
import {FieldPath, FieldValues} from 'react-hook-form';

import {
  StatePoolUpdatingValue,
  UsePoolStateProps,
  UsePoolStateReturns,
} from './types';

export function usePoolState<T extends FieldValues, P extends FieldPath<T>>({
  pool,
  fieldName,
  disabled,
}: UsePoolStateProps<T, P>): UsePoolStateReturns<T, P> {
  const [state, setState] = useState(() =>
    disabled ? undefined : pool.getValues(fieldName),
  );
  /**
   * To ensure that state's watching is fired synchronously, immediately right after state's declaration
   */
  const hookRef = useRef<any>({
    isMounting: true,
    fieldSub: undefined,
  });

  if (hookRef.current.isMounting) {
    hookRef.current.fieldSub = disabled
      ? undefined
      : pool.__ev__.addSub(fieldName, ({data}) => {
          setState(data[fieldName]);
        });
  }

  const updateField = useCallback(
    (updatingValue: StatePoolUpdatingValue<T, P>) => {
      pool.setValue(fieldName, updatingValue);
    },
    [setState, fieldName],
  );

  useEffect(() => {
    hookRef.current.isMounting = false;

    return () => {
      hookRef.current?.fieldSub?.unsubscribe();
      hookRef.current.fieldSub = undefined;
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      hookRef.current.fieldSub?.unsubscribe?.();
      hookRef.current.fieldSub = undefined;
      return;
    }

    if (hookRef.current.fieldSub) {
      return;
    }

    setState(pool.getValues(fieldName));
    hookRef.current.fieldSub = pool.__ev__.addSub(fieldName, ({data}) => {
      setState(data[fieldName]);
    });
  }, [disabled]);

  return [state, updateField];
}
