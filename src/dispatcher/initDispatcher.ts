import {isArray} from '../utils';

import {
  EventType,
  EventListenerType,
  EventSubscriptionType,
  DispatcherType,
} from './types';

export function initDispatcher<E extends EventType>(): DispatcherType<E> {
  let listeners: Record<string, Array<EventListenerType<E>>> = {};

  function resetContext() {
    listeners = {};
  }
  function getContext() {
    return {listeners};
  }

  function addListener(
    eventName: E['eventName'],
    listener: EventListenerType<E>,
  ) {
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }

    listeners[eventName].push(listener);
    return () => {
      listeners[eventName] = listeners[eventName].filter(_f => _f !== listener);
    };
  }

  function addSubscription(
    eventName: E['eventName'] | Array<E['eventName']>,
    listener: EventListenerType<E>,
  ): EventSubscriptionType {
    if (!isArray(eventName)) {
      return {
        unsubscribe: addListener(eventName, listener),
      };
    }

    const _removeListeners = eventName.map(_eventName =>
      addListener(_eventName, listener),
    );
    return {
      unsubscribe: () => _removeListeners.forEach(_f => _f()),
    };
  }

  function dispatch(Event: E) {
    listeners[Event.eventName]?.forEach(_f => _f(Event));
  }

  return {
    resetContext,
    getContext,
    addSubscription,
    dispatch,
  };
}
