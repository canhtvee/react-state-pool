import {FieldPath, Field, FieldValue, Room, FieldValues} from './types';
import {cloneObject, isArray} from '../utils';

export function initRoom<T extends Field>(initialData: T): Room<T> {
  let current = {...cloneObject(initialData)};

  const resetContext = () => {
    current = {...cloneObject(initialData)};
  };

  const set = (fieldName: FieldPath<T>, value: FieldValue<T, FieldPath<T>>) => {
    current[fieldName] = cloneObject(value);
  };

  const get = (fieldName: FieldPath<T>[] | FieldPath<T>) => {
    if (!fieldName) {
      return cloneObject(current);
    }

    if (isArray(fieldName)) {
      const values: FieldValues<T, FieldPath<T>[]> = [];
      fieldName.map(_name => current[_name]);
      return cloneObject(values);
    }

    return cloneObject(current[fieldName]);
  };

  return {
    set,
    get,
    resetContext,
  } as Room<T>;
}
