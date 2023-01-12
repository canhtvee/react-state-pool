export type EventType = {
  eventName: string;
  data?: Record<string, any>;
};

export type EventListenerType<E extends EventType> = (Event: E) => void;

export type EventSubscriptionType = {
  unsubscribe: () => void;
};

export type DispatcherType<E extends EventType> = {
  resetContext: () => void;
  getContext: () => {listeners: Record<string, Array<EventListenerType<E>>>};
  addSubscription: (
    eventName: E['eventName'] | Array<E['eventName']>,
    listener: EventListenerType<E>,
  ) => EventSubscriptionType;
  dispatch: (Event: E) => void;
};
