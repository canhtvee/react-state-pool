import {act} from '@testing-library/react';

import {isDeepEqual} from '../utils';
import {initStatePool} from '../initStatePool';

/**
 * Run test command
 * yarn test -u -t="initStatePool"
 */

describe('initStatePool', () => {
  const initData = {
    mField: 'mField',
    mObject: {field1: 'field1', field2: null},
    mArr: [1],
  };

  const pool = initStatePool<{
    mField: string;
    mObject: any;
    mArr: number[];
  }>(initData);

  beforeEach(() => {
    pool.reset();
  });

  test('should init correctly', () => {
    const {current, listeners} = pool.get();
    expect(listeners).toBeDefined();
    expect(isDeepEqual(current, initData)).toBeTruthy();
  });

  test('should getValues of single field correctly', () => {
    expect(pool.getValues('mField')).toEqual(initData.mField);
    expect(
      isDeepEqual(pool.getValues('mObject'), initData.mObject),
    ).toBeTruthy();
  });

  test('should getValue of multiple field correctly', () => {
    const partialInitData = [{field1: 'field1', field2: null}];

    expect(isDeepEqual(pool.getValues(), initData)).toBeTruthy();
    expect(
      isDeepEqual(pool.getValues(['mObject']), partialInitData),
    ).toBeTruthy();
    expect(
      isDeepEqual(pool.getValues(['mObject', 'mObject']), [
        ...partialInitData,
        ...partialInitData,
      ]),
    ).toBeTruthy();

    expect(
      isDeepEqual(
        pool.getValues(['mField', 'mObject', 'mArr']),
        Object.values(initData),
      ),
    ).toBeTruthy();
  });

  test('should setValue of single field correctly', async () => {
    pool.setValue('mField', 'test');
    expect(isDeepEqual(pool.getValues('mField'), 'test')).toBeTruthy();

    pool.setValue('mObject', {field1: 'ddd', field2: 'kaka'});
    expect(
      isDeepEqual(pool.getValues('mObject'), {field1: 'ddd', field2: 'kaka'}),
    ).toBeTruthy();

    pool.setValue('mArr', [1, 2]);
    expect(isDeepEqual(pool.getValues('mArr'), [1, 2])).toBeTruthy();

    await act(async () =>
      pool.setValue('mArr', prv => {
        prv.push(3);
        return prv;
      }),
    );

    expect(isDeepEqual(pool.getValues('mArr'), [1, 2, 3])).toBeTruthy();
  });

  test('should add subscribe of field correctly', async () => {
    const mockListener = jest.fn();

    const subscription = pool.__ev__.addSub('mArr', ({data}) => {
      mockListener(data);
    });

    pool.setValue('mArr', [1, 2]);
    expect(mockListener).toHaveBeenCalledWith({mArr: [1, 2]});
    expect(mockListener).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
    pool.setValue('mArr', [2]);
    expect(mockListener).toHaveBeenCalledTimes(1);
  });
});
