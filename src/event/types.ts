export type Event = {
  eventName: string;
  data?: Record<string, any>;
};

export type EventListener<E extends Event> = (Event: E) => void;

export type EventSubscription = {
  unsubscribe: () => void;
};

export type EventListeners<E extends Event> = Partial<
  Record<E['eventName'], EventListener<E>[]>
>;
