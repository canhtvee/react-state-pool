import {FieldPath, FieldValue, FieldValues} from 'react-hook-form';

import {cloneObject, isArray, isFunction} from './utils';
import {addEventSubscription, dispatchEvent} from './event';

import {
  PoolListener,
  PoolEvent,
  StatePool,
  PoolListeners,
  StatePoolSetValue,
} from './types';

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

  const getValues = (fieldName: FieldPath<T> | FieldPath<T>[] | undefined) => {
    if (!fieldName) {
      return cloneObject(current);
    }

    if (isArray(fieldName)) {
      const values = fieldName.map(_name => current[_name]);
      return cloneObject(values);
    }

    return cloneObject(current[fieldName]);
  };

  const setValue: StatePoolSetValue<T> = (
    fieldName: FieldPath<T>,
    updatingValue: FieldValue<T> | ((prev: FieldValue<T>) => FieldValue<T>),
  ) => {
    const newValue = isFunction(updatingValue)
      ? updatingValue(cloneObject(current[fieldName]))
      : updatingValue;

    current[fieldName] = newValue as T[FieldPath<T>];

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
    getValues,
    __ev__: {addSub},
  } as StatePool<T>;
}
