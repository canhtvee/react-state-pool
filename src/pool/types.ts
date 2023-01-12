import {
  DispatcherType,
  EventListenerType,
  EventSubscriptionType,
} from '../dispatcher';

export type FieldType = Record<string, any>;

export type FieldPathType<T extends FieldType> = `${keyof T & string}`;

export type FieldValueType<T extends FieldType> = T[FieldPathType<T>];

export type PartialFieldType<T extends FieldType> = {
  [P in FieldPathType<T>]?: T[P];
};

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
    current: T;
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
