import {isArray} from '../utils';

import {Event, EventListener, EventListeners, EventSubscription} from './types';
import {addListener} from './addListener';

export function addEventSubscription<E extends Event>(
  eventName: E['eventName'] | E['eventName'][],
  listener: EventListener<E>,
  listeners: EventListeners<E>,
): EventSubscription {
  if (isArray(eventName)) {
    const _removeListeners = eventName.map(_eventName =>
      addListener(_eventName, listener, listeners),
    );
    return {
      unsubscribe: () => _removeListeners.forEach(_f => _f()),
    };
  }

  return {
    unsubscribe: addListener(eventName, listener, listeners),
  };
}
