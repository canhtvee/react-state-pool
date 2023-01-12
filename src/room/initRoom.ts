import {
  FieldPathType,
  FieldType,
  FieldValueType,
  PartialFieldType,
  RoomType,
} from './types';
import {cloneObject} from '../utils';

export function initRoom<T extends FieldType>(initialData: T): RoomType<T> {
  let current = {...cloneObject(initialData)};

  const resetContext = () => {
    current = {...cloneObject(initialData)};
  };

  const set = (fieldName: FieldPathType<T>, value: FieldValueType<T>) => {
    current[fieldName] = cloneObject(value);
  };

  const getAll = () => cloneObject(current);

  const getSingle = (fieldName: FieldPathType<T>) =>
    cloneObject(current[fieldName]);

  const getMultiple = (fieldName: Array<FieldPathType<T>>) => {
    const values: PartialFieldType<T> = {};
    fieldName.forEach(
      _name => !!current[_name] && (values[_name] = current[_name]),
    );
    return cloneObject(values);
  };

  return {
    set,
    getAll,
    getSingle,
    getMultiple,
    resetContext,
  };
}
