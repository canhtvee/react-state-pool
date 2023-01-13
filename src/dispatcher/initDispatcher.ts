import {cloneObject, isArray} from '../utils';

import {Event, EventListener, EventSubscription, Dispatcher} from './types';

export function initDispatcher<E extends Event>(): Dispatcher<E> {
  let listeners: Record<string, Array<EventListener<E>>> = {};

  const resetContext = () => {
    listeners = {};
  };
  const getContext = () => {
    return {listeners};
  };

  const _addListener = (
    eventName: E['eventName'],
    listener: EventListener<E>,
  ) => {
    !listeners[eventName] && (listeners[eventName] = []);

    listeners[eventName].push(listener);
    return () => {
      listeners[eventName] = listeners[eventName].filter(_f => _f !== listener);
    };
  };

  const addSub = (
    eventName: E['eventName'] | E['eventName'][],
    listener: EventListener<E>,
  ): EventSubscription => {
    if (isArray(eventName)) {
      const _removeListeners = eventName.map(_eventName =>
        _addListener(_eventName, listener),
      );
      return {
        unsubscribe: () => _removeListeners.forEach(_f => _f()),
      };
    }

    return {
      unsubscribe: _addListener(eventName, listener),
    };
  };

  const dispatch = (event: E) => {
    listeners[event.eventName]?.forEach(_f => _f(cloneObject(event)));
  };

  return {
    resetContext,
    getContext,
    addSub,
    dispatch,
  };
}
