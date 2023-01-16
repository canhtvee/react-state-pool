import {isDeepEqual} from '../../utils';

/**
 * Run test command
 * yarn test -u -t="isDeepEqual"
 */

describe('isDeepEqual', () => {
  test('should return false when two sets not match', () => {
    expect(
      isDeepEqual([{test: '123'}, {test: '455'}, {test: '455'}], []),
    ).toBeFalsy();

    expect(
      isDeepEqual(
        [{test: '123'}, {test: '455'}, {test: '455'}],
        [{test: '123'}, {test: '455'}, {test: '455', test1: 'what'}],
      ),
    ).toBeFalsy();

    expect(isDeepEqual([{}], [])).toBeFalsy();

    expect(isDeepEqual([], [{}])).toBeFalsy();
    expect(isDeepEqual(new Date(), new Date('1999'))).toBeFalsy();

    expect(
      isDeepEqual(
        {
          unknown: undefined,
          userName: '',
          fruit: '',
        },
        {
          userName: '',
          fruit: '',
          break: {},
        },
      ),
    ).toBeFalsy();
  });

  test('should return false when either type is primitive', () => {
    expect(isDeepEqual(null, [])).toBeFalsy();
    expect(isDeepEqual([], null)).toBeFalsy();
    expect(isDeepEqual({}, undefined)).toBeFalsy();
    expect(isDeepEqual(undefined, {})).toBeFalsy();
  });

  test('should return true when two sets matches', () => {
    expect(
      isDeepEqual([{name: 'useFieldArray'}], [{name: 'useFieldArray'}]),
    ).toBeTruthy();

    expect(
      isDeepEqual(
        [{test: '123'}, {test: '455'}, {test: '455'}],
        [{test: '123'}, {test: '455'}, {test: '455'}],
      ),
    ).toBeTruthy();

    expect(
      isDeepEqual(
        [{test: '123'}, {test: null}, {test: '455'}],
        [{test: '123'}, {test: null}, {test: '455'}],
      ),
    ).toBeTruthy();

    expect(
      isDeepEqual(
        {
          obj1: null,
          obj2: {test: null, notNull: true},
          obj3: {test: '455'},
        },
        {
          obj3: {test: '455'},
          obj1: null,
          obj2: {notNull: true, test: null},
        },
      ),
    ).toBeTruthy();

    expect(isDeepEqual({}, {})).toBeTruthy();

    expect(isDeepEqual([], [])).toBeTruthy();

    expect(
      isDeepEqual(
        [{test: '123'}, {test: '455'}],
        [{test: '123'}, {test: '455'}],
      ),
    ).toBeTruthy();

    expect(
      isDeepEqual(
        [
          {
            test: '123',
            nestedArray: [{test: '123'}, {test: '455'}, {test: '455'}],
          },
          {
            test: '455',
            nestedArray: [{test: '123'}, {test: '455'}, {test: '455'}],
          },
        ],
        [
          {
            test: '123',
            nestedArray: [{test: '123'}, {test: '455'}, {test: '455'}],
          },
          {
            test: '455',
            nestedArray: [{test: '123'}, {test: '455'}, {test: '455'}],
          },
        ],
      ),
    ).toBeTruthy();
  });

  test('should compare date time object valueOf', () => {
    expect(
      isDeepEqual({test: new Date('1990')}, {test: new Date('1990')}),
    ).toBeTruthy();
  });
});
