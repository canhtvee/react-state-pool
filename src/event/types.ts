export type Event = {
  eventName: string;
  data?: Record<string, any>;
};

export type EventListener<E extends Event> = (Event: E) => void;

export type EventSubscription = {
  unsubscribe: () => void;
};

export type AddEventSubscription<E extends Event> = (
  eventName: E['eventName'] | E['eventName'][],
  listener: EventListener<E>,
) => EventSubscription;

export type DispatchEvent<E extends Event> = (event: E) => void;

export type EventListeners<E extends Event> = Record<
  E['eventName'],
  EventListener<E>[]
>;
