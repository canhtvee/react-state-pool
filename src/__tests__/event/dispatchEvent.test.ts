import {dispatchEvent} from '../../event/dispatchEvent';
import {addEventSubscription} from '../../event/addEventSubscription';

/**
 * Run test command
 * yarn test -u -t="dispatchEvent"
 */

describe('dispatchEvent', () => {
  let listeners = {};

  beforeEach(() => {
    listeners = {
      default: [],
    };
  });

  test('should dispatch event correctly', () => {
    const mockListener = jest.fn();
    addEventSubscription(['name1', 'name2'], mockListener, listeners);

    dispatchEvent({eventName: 'name1'}, listeners);
    expect(mockListener).toHaveBeenCalledTimes(1);

    dispatchEvent({eventName: 'name2'}, listeners);
    expect(mockListener).toHaveBeenCalledTimes(2);

    const _event = {eventName: 'name1', data: {test: 'test'}};
    dispatchEvent(_event, listeners);
    expect(mockListener).toHaveBeenCalledWith(_event);
  });
});
