import {cloneObject, isFunction} from '../utils';
import {addEventSubscription, dispatchEvent} from '../event';
import {getField, setField} from '../field';

import {PoolListener, PoolEvent, StatePool, PoolListeners} from './types';
import {FieldPath, FieldValue, FieldValues} from 'react-hook-form';

export function initStatePool<T extends FieldValues>(initialData: T) {
  let current = {...cloneObject(initialData)};
  let listeners: PoolListeners<T> = {};

  const reset = () => {
    current = {...cloneObject(initialData)};
    listeners = {};
  };
  const get = () => ({
    current,
    listeners,
  });

  const getValue = (fieldName?: FieldPath<T> | FieldPath<T>[]) =>
    getField(current, fieldName);

  const setValue = (
    fieldName: FieldPath<T>,
    updatingValue: FieldValue<T> | ((prev: FieldValue<T>) => FieldValue<T>),
  ) => {
    const newValue = isFunction(updatingValue)
      ? updatingValue(getField(fieldName, current) as FieldValue<T>)
      : updatingValue;

    setField(current, fieldName, newValue);

    dispatchEvent(
      {
        eventName: fieldName,
        data: {[fieldName]: newValue},
      } as PoolEvent<T>,
      listeners,
    );
  };

  const addSub = (
    fieldName: FieldPath<T> | FieldPath<T>[],
    listener: PoolListener<T>,
  ) => addEventSubscription(fieldName, listener, listeners);

  return {
    reset,
    get,
    setValue,
    getValue,
    __ev__: {addSub},
  } as StatePool<T>;
}
