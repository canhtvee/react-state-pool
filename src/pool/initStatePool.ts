import {cloneObject, isFunction} from '../utils';

import {Field, FieldPath, FieldValue, getField} from '../field';

import {PoolListener, PoolEvent} from './types';
import {addEventSubscription, dispatchEvent, EventListeners} from '../event';
import {setField} from '../field/services';

export function initStatePool<T extends Field>(initialData: T) {
  let current = {...cloneObject(initialData)};
  let listeners = {} as EventListeners<PoolEvent<T>>;

  const resetContext = () => {
    current = {...cloneObject(initialData)};
    listeners = {} as EventListeners<PoolEvent<T>>;
  };
  const getContext = () => ({
    current,
    listeners,
  });

  function getValue(fieldName?: FieldPath<T> | FieldPath<T>[]) {
    return getField(fieldName, current);
  }

  const setValue = (
    fieldName: FieldPath<T>,
    updatingValue: FieldValue<T> | ((prev: FieldValue<T>) => FieldValue<T>),
  ) => {
    const newValue = isFunction(updatingValue)
      ? updatingValue(getField(fieldName, current) as FieldValue<T>)
      : updatingValue;

    setField(fieldName, newValue, current);

    dispatchEvent(
      {
        eventName: fieldName,
        data: {[fieldName]: newValue},
      } as PoolEvent<T>,
      listeners,
    );
  };

  function subscribe(
    fieldName: FieldPath<T> | FieldPath<T>[],
    listener: PoolListener<T>,
  ) {
    return addEventSubscription(fieldName, listener, listeners);
  }

  return {
    resetContext,
    getContext,
    setValue,
    getValue,
    __ev__: {subscribe},
  };
}
