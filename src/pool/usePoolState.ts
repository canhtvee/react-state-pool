import {useCallback, useEffect, useRef, useState} from 'react';

import {FieldType, FieldValueType} from '../field';

import {UsePoolStateArgmentType, UsePoolStateReturnType} from './types';

export function usePoolState<T extends FieldType>({
  fieldName,
  disabled,
  pool,
}: UsePoolStateArgmentType<T>): UsePoolStateReturnType<T> {
  const [state, setState] = useState(() =>
    disabled ? undefined : pool.getValue(fieldName),
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
      : pool.__ev__.subscribe(fieldName, ({data}) => {
          setState(data[fieldName]);
        });
    hookRef.current.isMounting = false;
  }

  const updateField = useCallback(
    (
      updatingValue:
        | FieldValueType<T>
        | ((prev: FieldValueType<T>) => FieldValueType<T>),
    ) => {
      pool.setValue(fieldName, updatingValue);
    },
    [setState, fieldName],
  );

  useEffect(() => {
    if (disabled) {
      hookRef.current.fieldSub?.unsubscribe?.();
      hookRef.current.fieldSub = undefined;
      return;
    }

    if (hookRef.current.fieldSub) {
      return;
    }

    setState(pool.getValue(fieldName));
    hookRef.current.fieldSub = pool.__ev__.subscribe(fieldName, ({data}) => {
      setState(data[fieldName]);
    });
  }, [disabled]);

  useEffect(() => {
    return () => {
      hookRef.current?.fieldSub?.unsubscribe();
      hookRef.current.fieldSub = undefined;
    };
  }, []);

  return [state as FieldValueType<T>, updateField];
}
