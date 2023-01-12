import React, {useState} from 'react';
import {act, cleanup, render} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {initStatePool, usePoolState} from '../pool';

/**
 * Run test command
 * yarn test -u -t="usePoolState"
 */

afterEach(cleanup);

const pool = initStatePool({
  default: 'default',
  test: 'test',
  isVisible: true,
  isMultiple: false,
});

describe('usePoolState', () => {
  beforeEach(() => {
    pool.resetContext();
  });

  test('should return default value in pool', () => {
    const {result} = renderHook(() => {
      return usePoolState({
        pool,
        fieldName: 'default',
      });
    });

    expect(result.current[0]).toEqual('default');
  });

  test('should return current value in pool at start watching', () => {
    pool.setValue('test', 'test-start-watch');

    const {result} = renderHook(() => {
      return usePoolState({
        pool,
        fieldName: 'test',
      });
    });

    expect(result.current[0]).toEqual('test-start-watch');
  });

  test('should update value as pool update', async () => {
    let testSetTest: any;

    const Component = () => {
      const [test, setTest] = usePoolState({pool, fieldName: 'test'});

      testSetTest = (value: string) => setTest(value);

      return <p>{test?.toString()}</p>;
    };

    const {getByText} = render(<Component />);

    expect(getByText('test')).toBeDefined();

    await act(async () => pool.setValue('test', 'newTest'));
    expect(getByText('newTest')).toBeDefined();

    await act(async () => testSetTest('testSetTest'));
    expect(getByText('testSetTest')).toBeDefined();
  });

  test('should remove listener on unmount', async () => {
    const Component = () => {
      usePoolState({pool, fieldName: 'test'});
      return <div />;
    };
    const {unmount} = render(<Component />);

    const {dispatcher} = pool.getContext();
    const {listeners} = dispatcher.getContext();

    expect(listeners.test.length).toEqual(1);

    unmount();
    expect(listeners.test.length).toEqual(0);
  });

  describe('when disabled prop is used', () => {
    test('should return undefined value as delare hook', () => {
      const {result} = renderHook(() => {
        return usePoolState({
          pool,
          fieldName: 'default',
          disabled: true,
        });
      });

      expect(result.current[0]).toBeUndefined();
    });

    test('should re-subscribe as toggle disabled', async () => {
      let changeDisabled;
      let changeText;

      const Component = () => {
        const [disabled, setDisabled] = useState(false);
        const [test, setTest] = usePoolState({
          pool,
          fieldName: 'test',
          disabled,
        });

        changeText = (value: string) => setTest(value);
        changeDisabled = (value: boolean) => setDisabled(value);

        return <p>{test?.toString()}</p>;
      };

      const {getByText} = render(<Component />);

      expect(getByText('test')).toBeDefined();

      await act(async () => changeDisabled(true));
      await act(async () => changeText('test-disabled'));

      expect(pool.getValue('test')).toEqual('test-disabled');
      expect(getByText('test')).toBeDefined();

      await act(async () => changeDisabled(false));
      expect(getByText('test-disabled')).toBeDefined();
    });

    test('should remove listener on disabled', async () => {
      const Component = () => {
        const [visible] = usePoolState({pool, fieldName: 'isVisible'});
        const [test] = usePoolState({
          pool,
          fieldName: 'test',
          disabled: !visible as boolean,
        });

        return <p>{test?.toString()}</p>;
      };

      const tree1 = render(<Component />);
      render(<Component />);

      const {dispatcher} = pool.getContext();
      const {listeners} = dispatcher.getContext();

      expect(listeners.test.length).toEqual(2);

      await act(async () => pool.setValue('isVisible', false));
      expect(listeners.test.length).toEqual(0);

      await act(async () => pool.setValue('isVisible', true));
      expect(listeners.test.length).toEqual(2);

      tree1.unmount();
      expect(listeners.test.length).toEqual(1);

      await act(async () => pool.setValue('isVisible', false));
      expect(listeners.test.length).toEqual(0);
    });
  });
});
