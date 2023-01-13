import {EventListener} from '../event';
import {FieldPath, Field, FieldValue} from '../field';

export type PoolEvent<T extends Field> = {
  eventName: FieldPath<T>;
  data: FieldValue<T, FieldPath<T>>;
};

export type PoolListener<T extends Field> = EventListener<PoolEvent<T>>;

export type StatePool<T extends Field> = {
  resetContext: () => void;

  setValue: (
    fieldName: FieldPath<T>,
    updatingValue: FieldValue<T> | ((prev: FieldValue<T>) => FieldValue<T>),
  ) => void;
};
