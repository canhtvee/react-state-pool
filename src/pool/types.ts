import {
  DispatcherType,
  EventListenerType,
  EventSubscriptionType,
} from '../dispatcher';

import {
  FieldPathType,
  FieldType,
  FieldValueType,
  PartialFieldType,
  RoomType,
} from '../room';

export type PoolEventType<T extends FieldType> = {
  eventName: FieldPathType<T>;
  data: PartialFieldType<T>;
};

export type PoolListenerType<T extends FieldType> = EventListenerType<
  PoolEventType<T>
>;

export type StatePoolType<T extends FieldType> = {
  resetContext: () => void;

  getContext: () => {
    dispatcher: DispatcherType<PoolEventType<T>>;
    room: RoomType<T>;
  };

  setValue: (
    fieldName: FieldPathType<T>,
    updatingValue:
      | FieldValueType<T>
      | ((prev: FieldValueType<T>) => FieldValueType<T>),
  ) => void;

  getValue: (
    fieldName?: FieldPathType<T> | Array<FieldPathType<T>>,
  ) => FieldValueType<T> | PartialFieldType<T> | T;

  __ev__: {
    subscribe: (
      fieldName: FieldPathType<T> | Array<FieldPathType<T>>,
      listener: PoolListenerType<T>,
    ) => EventSubscriptionType;
  };
};

export type UsePoolStateArgmentType<T extends FieldType> = {
  pool: StatePoolType<T>;
  fieldName: FieldPathType<T>;
  disabled?: boolean;
};

export type UsePoolStateReturnType<T extends FieldType> = [
  FieldValueType<T>,
  (
    updatingValue:
      | FieldValueType<T>
      | ((prev: FieldValueType<T>) => FieldValueType<T>),
  ) => void,
];
