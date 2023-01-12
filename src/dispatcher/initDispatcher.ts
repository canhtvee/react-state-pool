import {cloneObject} from '../utils';

import {
  EventType,
  EventListenerType,
  EventSubscriptionType,
  DispatcherType,
} from './types';

export function initDispatcher<E extends EventType>(): DispatcherType<E> {
  let listeners: Record<string, Array<EventListenerType<E>>> = {};

  const resetContext = () => {
    listeners = {};
  };
  const getContext = () => {
    return {listeners};
  };

  const _addListener = (
    eventName: E['eventName'],
    listener: EventListenerType<E>,
  ) => {
    !listeners[eventName] && (listeners[eventName] = []);

    listeners[eventName].push(listener);
    return () => {
      listeners[eventName] = listeners[eventName].filter(_f => _f !== listener);
    };
  };

  const addSingleSub = (
    eventName: E['eventName'],
    listener: EventListenerType<E>,
  ): EventSubscriptionType => {
    return {
      unsubscribe: _addListener(eventName, listener),
    };
  };

  const addMultipleSub = (
    eventName: Array<E['eventName']>,
    listener: EventListenerType<E>,
  ): EventSubscriptionType => {
    const _removeListeners = eventName.map(_eventName =>
      _addListener(_eventName, listener),
    );
    return {
      unsubscribe: () => _removeListeners.forEach(_f => _f()),
    };
  };

  const dispatch = (Event: E) => {
    listeners[Event.eventName]?.forEach(_f => _f(cloneObject(Event)));
  };

  return {
    resetContext,
    getContext,
    addSingleSub,
    addMultipleSub,
    dispatch,
  };
}
