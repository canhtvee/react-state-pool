import {addListener} from '../../event/addListener';

/**
 * Run test command
 * yarn test -u -t="addListener"
 */

describe('addListener', () => {
  let listeners = {};

  beforeEach(() => {
    listeners = {
      default: [],
    };
  });

  test('should add listener correctly', () => {
    const name = 'name';
    const mockListener = jest.fn();
    const removeListner = addListener(name, mockListener, listeners);

    expect(listeners[name].length).toEqual(1);
    expect(listeners[name].includes(mockListener)).toBeTruthy();

    removeListner();

    expect(listeners[name].includes(mockListener)).toBeFalsy();
    expect(listeners[name].length).toEqual(0);
  });
});
