import {addEventSubscription} from '../../event/addEventSubscription';

/**
 * Run test command
 * yarn test -u -t="addEventSubscription"
 */

describe('addEventSubscription', () => {
  let listeners = {};

  beforeEach(() => {
    listeners = {
      default: [],
    };
  });

  test('should add subscription correctly', () => {
    const mockListener = jest.fn();
    const name1Sub = addEventSubscription('name1', mockListener, listeners);
    expect(listeners['name1'].includes(mockListener)).toBeTruthy();

    const name2n3Sub = addEventSubscription(
      ['name2', 'name3'],
      mockListener,
      listeners,
    );
    expect(listeners['name2'].includes(mockListener)).toBeTruthy();
    expect(listeners['name3'].includes(mockListener)).toBeTruthy();
    console.log(listeners);

    name1Sub.unsubscribe();
    name2n3Sub.unsubscribe();
    expect(listeners['name1'].length).toEqual(0);
    expect(listeners['name2'].length).toEqual(0);
    expect(listeners['name3'].length).toEqual(0);

    console.log(listeners);
  });
});
