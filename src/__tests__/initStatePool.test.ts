import {initStatePool} from '../pool';
import {isDeepEqual} from '../utils';
import {act} from '@testing-library/react';

/**
 * Run test command
 * yarn test -u -t="initStatePool"
 */

describe('initStatePool', () => {
  test('should getContext correctly', () => {
    const {room, dispatcher} = initStatePool({}).getContext();

    expect(dispatcher).toBeDefined();
    expect(room).toBeDefined();
  });

  test('should init correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: 'field2'},
    };
    const {room, dispatcher} = initStatePool(initData).getContext();

    expect(dispatcher).toBeDefined();
    expect(isDeepEqual(room.getAll(), initData)).toBeTruthy();
  });

  test('should getValue of single field correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: 'field2'},
    };

    const pool = initStatePool(initData);

    expect(pool.getValue('mField')).toEqual(initData.mField);

    expect(isDeepEqual(pool.getValue('mObject'), initData.mObject)).toBe(true);
  });

  test('should getValue of multiple field correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: null},
    };

    const partialInitData = {
      mObject: {field1: 'field1', field2: null},
    };

    const pool = initStatePool(initData);

    expect(isDeepEqual(pool.getValue(), initData)).toBeTruthy();

    expect(
      isDeepEqual(pool.getValue(['mObject']), partialInitData),
    ).toBeTruthy();

    expect(
      isDeepEqual(pool.getValue(['mObject', 'mObject']), partialInitData),
    ).toBeTruthy();

    expect(
      isDeepEqual(pool.getValue(['mField', 'mObject']), initData),
    ).toBeTruthy();
  });

  test('should setValue of single field correctly', async () => {
    const initData = {
      mField: 'mField',
      mObject: {},
      mArr: [],
    };

    const pool = initStatePool(initData);

    pool.setValue('mField', {test: 'test'});
    expect(isDeepEqual(pool.getValue('mField'), {test: 'test'})).toBeTruthy();

    pool.setValue('mField', {});
    expect(isDeepEqual(pool.getValue('mField'), {test: 'test'})).toBeFalsy();

    pool.setValue('mArr', [1, 2]);
    expect(isDeepEqual(pool.getValue('mArr'), [1, 2])).toBeTruthy();

    await act(async () =>
      pool.setValue('mArr', (prv: Array<number>) => {
        prv.push(3);
        return prv;
      }),
    );

    expect(isDeepEqual(pool.getValue('mArr'), [1, 2, 3])).toBeTruthy();
  });
});
