import {useCallback, useEffect, useRef, useState} from 'react';

import {EventSubscriptionType} from '../dispatcher';

import {
  FieldType,
  FieldValueType,
  UsePoolStateArgmentType,
  UsePoolStateReturnType,
} from './types';

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
  const fieldSubscriptionRef = useRef<EventSubscriptionType | undefined>(
    disabled
      ? undefined
      : pool.__ev__.subscribe(fieldName, ({data}) => {
          setState(data[fieldName]);
        }),
  );

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
    if (disabled || fieldSubscriptionRef.current) {
      return;
    }

    setState(pool.getValue(fieldName));
    fieldSubscriptionRef.current = pool.__ev__.subscribe(
      fieldName,
      ({data}) => {
        setState(data[fieldName]);
      },
    );

    return () => {
      fieldSubscriptionRef.current?.unsubscribe();
      fieldSubscriptionRef.current = undefined;
    };
  }, [disabled]);

  return [state as FieldValueType<T>, updateField];
}
