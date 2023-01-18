import {
  FieldPath,
  FieldValues,
  FieldPathValue,
  UseFormGetValues,
} from 'react-hook-form';

import {EventListener, EventListeners, EventSubscription} from './event';

export type PoolEvent<T extends FieldValues> = {
  eventName: FieldPath<T>;
  data: Pick<T, FieldPath<T>>;
};

export type PoolListener<T extends FieldValues> = EventListener<PoolEvent<T>>;
export type PoolListeners<T extends FieldValues> = EventListeners<PoolEvent<T>>;

export type AddPoolEventSubscription<T extends FieldValues> = (
  eventName: PoolEvent<T>['eventName'],
  listener: PoolListener<T>,
) => EventSubscription;

export type PoolContext<T extends FieldValues> = {
  current: T;
  listeners: PoolListeners<T>;
};

export type StatePoolUpdatingValue<
  T extends FieldValues,
  P extends FieldPath<T>,
> =
  | FieldPathValue<T, P>
  | ((prev: FieldPathValue<T, P>) => FieldPathValue<T, P>);

export type StatePoolSetValue<T extends FieldValues> = <P extends FieldPath<T>>(
  fieldName: P,
  value: StatePoolUpdatingValue<T, P>,
) => void;

export type StatePool<T extends FieldValues> = {
  reset: () => void;
  get: () => PoolContext<T>;
  setValue: StatePoolSetValue<T>;
  getValues: UseFormGetValues<T>;

  __ev__: {addSub: AddPoolEventSubscription<T>};
};

export type UsePoolStateProps<T extends FieldValues, P extends FieldPath<T>> = {
  fieldName: P;
  pool: StatePool<T>;
  disabled?: boolean;
};

export type UsePoolStateReturns<
  T extends FieldValues,
  P extends FieldPath<T>,
> = [
  FieldPathValue<T, P> | undefined,
  (updatingValue: StatePoolUpdatingValue<T, P>) => void,
];

export type UsePoolState<T extends FieldValues, P extends FieldPath<T>> = ({
  fieldName,
  pool,
  disabled,
}: UsePoolStateProps<T, P>) => void;
