import {FieldPath, Field, FieldValue, FieldValues} from './types';
import {cloneObject, isArray} from '../utils';

export function setField<T extends Field>(
  fieldName: FieldPath<T>,
  value: FieldValue<T, FieldPath<T>>,
  current: T,
) {
  current[fieldName] = cloneObject(value);
}

export function getField<T extends Field>(
  fieldName: FieldPath<T>[] | FieldPath<T> | undefined,
  current: T,
) {
  if (!fieldName) {
    return cloneObject(current);
  }

  if (isArray(fieldName)) {
    const values: FieldValues<T, FieldPath<T>[]> = [];
    fieldName.map(_name => current[_name]);
    return cloneObject(values);
  }

  return cloneObject(current[fieldName]);
}
