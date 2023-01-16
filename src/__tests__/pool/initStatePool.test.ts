import {initStatePool} from '../../pool';
import {isDeepEqual} from '../../utils';
import {act} from '@testing-library/react';

/**
 * Run test command
 * yarn test -u -t="initStatePool"
 */

describe('initStatePool', () => {
  test('should init correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: 'field2'},
    };
    const {current, listeners} = initStatePool(initData).get();

    expect(listeners).toBeDefined();
    expect(isDeepEqual(current, initData)).toBeTruthy();
  });

  test('should getValues of single field correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: 'field2'},
    };

    const pool = initStatePool(initData);

    expect(pool.getValues('mField')).toEqual(initData.mField);
    expect(
      isDeepEqual(pool.getValues('mObject'), initData.mObject),
    ).toBeTruthy();
  });

  test('should getValue of multiple field correctly', () => {
    const initData = {
      mField: 'mField',
      mObject: {field1: 'field1', field2: null},
    };
    const partialInitData = [{field1: 'field1', field2: null}];

    const pool = initStatePool(initData);

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
        pool.getValues(['mField', 'mObject']),
        Object.values(initData),
      ),
    ).toBeTruthy();
  });

  test('should setValue of single field correctly', async () => {
    const initData = {
      mField: 'mField',
      mObject: {},
      mArr: [1],
    };

    const pool = initStatePool(initData);

    pool.setValue('mField', 'test');
    expect(isDeepEqual(pool.getValues('mField'), 'test')).toBeTruthy();

    pool.setValue('mObject', {field: 'field'});
    expect(
      isDeepEqual(pool.getValues('mObject'), {field: 'field'}),
    ).toBeTruthy();

    pool.setValue('mArr', [1, 2]);
    expect(isDeepEqual(pool.getValues('mArr'), [1, 2])).toBeTruthy();

    await act(async () =>
      pool.setValue('mArr', (prv: Array<number>) => {
        prv.push(3);
        return prv;
      }),
    );

    expect(isDeepEqual(pool.getValues('mArr'), [1, 2, 3])).toBeTruthy();
  });
});
