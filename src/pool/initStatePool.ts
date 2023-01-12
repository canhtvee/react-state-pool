import {isArray, isFunction} from '../utils';
import {initDispatcher, EventSubscriptionType} from '../dispatcher';

import {
  FieldPathType,
  FieldType,
  FieldValueType,
  PartialFieldType,
  PoolListenerType,
  PoolEventType,
  StatePoolType,
} from './types';

export function initStatePool<T extends FieldType>(
  initialData: T,
): StatePoolType<T> {
  let current = {...initialData};
  const dispatcher = initDispatcher<PoolEventType<T>>();

  function resetContext() {
    current = {...initialData};
    dispatcher.resetContext();
  }
  function getContext() {
    return {
      dispatcher,
      current,
    };
  }

  function getValue(
    fieldName?: FieldPathType<T> | Array<FieldPathType<T>>,
  ): FieldValueType<T> | PartialFieldType<T> | T {
    if (!fieldName) {
      return current;
    }
    if (!isArray(fieldName)) {
      return current[fieldName];
    }

    const values: PartialFieldType<T> = {};
    fieldName.forEach(
      _name => !!current[_name] && (values[_name] = current[_name]),
    );
    return values;
  }

  function setValue(
    fieldName: FieldPathType<T>,
    updatingValue:
      | FieldValueType<T>
      | ((prev: FieldValueType<T>) => FieldValueType<T>),
  ) {
    const newValue = isFunction(updatingValue)
      ? updatingValue(current[fieldName])
      : updatingValue;

    current = {...current, [fieldName]: newValue};

    const Event = {
      eventName: fieldName,
      data: {[fieldName]: newValue},
    };

    dispatcher.dispatch(Event as PoolEventType<T>);
  }

  function subscribe(
    fieldName: FieldPathType<T> | Array<FieldPathType<T>>,
    listener: PoolListenerType<T>,
  ): EventSubscriptionType {
    return dispatcher.addSubscription(fieldName, listener);
  }

  return {
    resetContext,
    getContext,
    setValue,
    getValue,
    __ev__: {subscribe},
  };
}
