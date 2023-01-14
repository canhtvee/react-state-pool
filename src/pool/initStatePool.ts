import {cloneObject, isFunction} from '../utils';
import {addEventSubscription, dispatchEvent} from '../event';
import {Field, FieldPath, FieldValue, getField, setField} from '../field';

import {PoolListener, PoolEvent, StatePool, PoolListeners} from './types';

export function initStatePool<T extends Field>(initialData: T) {
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
    getField(fieldName, current);

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

// const initial = {
//   testString: 'string',
//   testArray: ['string', 'number'],
// };

// const pool = initStatePool(initial);

// pool.setValue('testArray', ['kaka']);
// const arr = pool.getValue('testArray');
// const str = pool.getValue('testString');

// const [val1, val2] = pool.getValue(['testString', 'testArray']);
