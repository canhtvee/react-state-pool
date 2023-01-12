import {initDispatcher} from '../dispatcher';
import {isFunction} from '../utils';

/**
 * Run test command
 * yarn test -u -t="initDispatcher"
 */

describe('initDispatcher', () => {
  test('should return context correctly', () => {
    const mockListener = jest.fn();
    const mockEventName = 'test-getContext';

    const dispatcher = initDispatcher();
    dispatcher.addSingleSub(mockEventName, mockListener);

    const context = dispatcher.getContext();
    expect(context.listeners).toBeDefined();
  });

  test('should add listener correctly on subscribe', () => {
    const mockListener = jest.fn();
    const mockEventName = 'test-adSubscription';

    const dispatcher = initDispatcher();
    const subscriptions = dispatcher.addSingleSub(mockEventName, mockListener);

    const {listeners} = dispatcher.getContext();
    expect(listeners[mockEventName].length).toBe(1);
    expect(listeners[mockEventName].includes(mockListener)).toBeTruthy();
    expect(isFunction(subscriptions.unsubscribe)).toBeTruthy();
  });

  test('should invoke listener if event presented', () => {
    const mockListener = jest.fn();
    const mockEventName = 'test-dispatch';

    const dispatcher = initDispatcher();
    dispatcher.addSingleSub(mockEventName, mockListener);

    const mockEvent = {
      eventName: mockEventName,
      data: {mockField: 'mockField'},
    };
    dispatcher.dispatch(mockEvent);

    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith(mockEvent);

    dispatcher.dispatch(mockEvent);

    expect(mockListener).toHaveBeenCalledTimes(2);
  });

  test('should remove listener correctly on unsubscribe', () => {
    const mockListener = jest.fn();
    const mockEventName = 'test-unsubscribe';

    const dispatcher = initDispatcher();
    const subscriptions = dispatcher.addSingleSub(mockEventName, mockListener);
    expect(isFunction(subscriptions.unsubscribe)).toBeTruthy();

    subscriptions.unsubscribe();

    const {listeners} = dispatcher.getContext();
    expect(listeners[mockEventName].length).toBe(0);
    expect(listeners[mockEventName].includes(mockListener)).toBeFalsy();
  });

  test('should reset correctly', () => {
    const mockListener = jest.fn();
    const mockEventName = 'test-resetContext';

    const dispatcher = initDispatcher();
    dispatcher.addSingleSub(mockEventName, mockListener);

    const {listeners: listenersBeforeReset} = dispatcher.getContext();
    expect(listenersBeforeReset[mockEventName].length).toBe(1);

    dispatcher.resetContext();

    const {listeners: listenersAfterReset} = dispatcher.getContext();
    expect(listenersAfterReset[mockEventName]).toBeUndefined();
  });
});
