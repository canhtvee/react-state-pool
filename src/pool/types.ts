import {AddEventSubscription, EventListener, EventListeners} from '../event';
import {FieldPath, Field, FieldValue, GetField} from '../field';

export type PoolEvent<T extends Field> = {
  eventName: FieldPath<T>;
  data: FieldValue<T, FieldPath<T>>;
};

export type PoolListener<T extends Field> = EventListener<PoolEvent<T>>;
export type PoolListeners<T extends Field> = Partial<
  EventListeners<PoolEvent<T>>
>;

export type PoolContext<T extends Field> = {
  current: T;
  listeners: PoolListeners<T>;
};

export type StatePoolUpdatingValue<T extends Field, P extends FieldPath<T>> =
  | FieldValue<T, P>
  | ((prev: FieldValue<T, P>) => FieldValue<T, P>);

export type StatePool<T extends Field> = {
  reset: () => void;
  get: () => PoolContext<T>;

  setValue: <P extends FieldPath<T>>(
    fieldName: P,
    updatingValue: StatePoolUpdatingValue<T, P>,
  ) => void;

  getValue: GetField<T>;

  __ev__: {addSub: AddEventSubscription<PoolEvent<T>>};
};

export type UsePoolStateProps<T extends Field, P extends FieldPath<T>> = {
  fieldName: P;
  pool: StatePool<T>;
  disabled?: boolean;
};

export type UsePoolStateReturns<T extends Field, P extends FieldPath<T>> = [
  FieldValue<T, P> | undefined,
  (updatingValue: StatePoolUpdatingValue<T, P>) => void,
];

export type UsePoolState<T extends Field, P extends FieldPath<T>> = ({
  fieldName,
  pool,
  disabled,
}: UsePoolStateProps<T, P>) => void;
