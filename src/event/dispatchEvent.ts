import {cloneObject} from '../utils';

import {Event, EventListeners} from './types';

export function dispatchEvent<E extends Event>(
  event: E,
  listeners: EventListeners<E>,
) {
  listeners[event.eventName as E['eventName']]?.forEach(_f =>
    _f(cloneObject(event)),
  );
}
