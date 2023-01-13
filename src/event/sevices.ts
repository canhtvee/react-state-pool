import {cloneObject, isArray} from '../utils';
import {Event, EventListener, EventListeners, EventSubscription} from './types';

const _addListener = <E extends Event>(
  eventName: E['eventName'],
  listener: EventListener<E>,
  listeners: EventListeners<E>,
) => {
  !listeners[eventName] && (listeners[eventName] = []);

  listeners[eventName].push(listener);
  return () => {
    listeners[eventName] = listeners[eventName].filter(_f => _f !== listener);
  };
};

export function dispatchEvent<E extends Event>(
  event: E,
  listeners: EventListeners<E>,
) {
  listeners[event.eventName as E['eventName']]?.forEach(_f =>
    _f(cloneObject(event)),
  );
}

export function addEventSubscription<E extends Event>(
  eventName: E['eventName'] | E['eventName'][],
  listener: EventListener<E>,
  listeners: EventListeners<E>,
): EventSubscription {
  if (isArray(eventName)) {
    const _removeListeners = eventName.map(_eventName =>
      _addListener(_eventName, listener, listeners),
    );
    return {
      unsubscribe: () => _removeListeners.forEach(_f => _f()),
    };
  }

  return {
    unsubscribe: _addListener(eventName, listener, listeners),
  };
}
