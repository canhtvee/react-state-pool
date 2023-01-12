import React from 'react';
import {act, fireEvent, render} from '@testing-library/react';

import {renderHook} from '@testing-library/react-hooks';

import {initStatePool, usePoolState} from '../pool';

/**
 * Run test command
 * yarn test -u -t="usePoolState"
 */

const pool = initStatePool<{
  default: string;
  test: string;
  isVisible: boolean;
  isMultiple: boolean;
}>({default: 'default', test: 'test', isVisible: true, isMultiple: false});

describe('usePoolState', () => {
  beforeEach(() => {
    pool.resetContext();
  });

  it('should return default value in pool', () => {
    const {result} = renderHook(() => {
      return usePoolState({
        pool,
        fieldName: 'default',
      });
    });

    const [value] = result.current;
    expect(value).toEqual('default');
  });

  it('should return current value in pool at start watching', () => {
    pool.setValue('test', 'test-start-watch');

    const {result} = renderHook(() => {
      return usePoolState({
        pool,
        fieldName: 'test',
      });
    });

    const [value] = result.current;
    expect(value).toEqual('test-start-watch');
  });

  it('should update value as pool update', async () => {
    let testSetTest: any;

    const Component = () => {
      const [test, setTest] = usePoolState({pool, fieldName: 'test'});

      testSetTest = (value: string) => setTest(value);

      return (
        <div>
          <p>{test?.toString()}</p>
        </div>
      );
    };

    const {getByText, getAllByText} = render(<Component />);

    expect(getByText('test')).toBeDefined();

    await act(async () => pool.setValue('test', 'newTest'));
    expect(getAllByText('newTest').length > 0).toBeTruthy();

    await act(async () => testSetTest('testSetTest'));
    expect(getAllByText('testSetTest').length > 0).toBeTruthy();
  });
});
