import {isArray} from '../utils';
import {Event, EventListener, EventListeners} from './types';

export function addListener<E extends Event>(
  eventName: E['eventName'],
  listener: EventListener<E>,
  listeners: EventListeners<E>,
) {
  !isArray(listeners[eventName]) && (listeners[eventName] = []);

  listeners[eventName]!.push(listener);
  return () => {
    listeners[eventName] = listeners[eventName]!.filter(_f => _f !== listener);
  };
}
