import {isArray, isFunction} from '../utils';
import {initDispatcher, EventSubscriptionType} from '../dispatcher';
import {
  FieldPathType,
  FieldType,
  FieldValueType,
  initRoom,
  PartialFieldType,
} from '../room';

import {PoolListenerType, PoolEventType, StatePoolType} from './types';

export function initStatePool<T extends FieldType>(
  initialData: T,
): StatePoolType<T> {
  const room = initRoom<T>(initialData);
  const dispatcher = initDispatcher<PoolEventType<T>>();

  const resetContext = () => {
    room.resetContext();
    dispatcher.resetContext();
  };
  const getContext = () => ({
    dispatcher,
    room,
  });

  function getValue(
    fieldName?: FieldPathType<T> | Array<FieldPathType<T>>,
  ): FieldValueType<T> | PartialFieldType<T> | T {
    if (!fieldName) {
      return room.getAll();
    }
    if (isArray(fieldName)) {
      return room.getMultiple(fieldName);
    }
    return room.getSingle(fieldName);
  }

  const setValue = (
    fieldName: FieldPathType<T>,
    updatingValue:
      | FieldValueType<T>
      | ((prev: FieldValueType<T>) => FieldValueType<T>),
  ) => {
    const newValue = isFunction(updatingValue)
      ? updatingValue(room.getSingle(fieldName))
      : updatingValue;

    room.set(fieldName, newValue);

    dispatcher.dispatch({
      eventName: fieldName,
      data: {[fieldName]: newValue},
    } as PoolEventType<T>);
  };

  function subscribe(
    fieldName: FieldPathType<T> | Array<FieldPathType<T>>,
    listener: PoolListenerType<T>,
  ): EventSubscriptionType {
    if (isArray(fieldName)) {
      return dispatcher.addMultipleSub(fieldName, listener);
    }

    return dispatcher.addSingleSub(fieldName, listener);
  }

  return {
    resetContext,
    getContext,
    setValue,
    getValue,
    __ev__: {subscribe},
  };
}
