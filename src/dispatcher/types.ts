export type Event = {
  eventName: string;
  data?: Record<string, any>;
};

export type EventListener<E extends Event> = (Event: E) => void;

export type EventSubscription = {
  unsubscribe: () => void;
};

export type Dispatcher<E extends Event> = {
  resetContext: () => void;

  getContext: () => {
    listeners: Record<string, EventListener<E>[]>;
  };

  addSub: (
    eventName: E['eventName'] | E['eventName'][],
    listener: EventListener<E>,
  ) => EventSubscription;

  dispatch: (Event: E) => void;
};
