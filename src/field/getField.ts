import {FieldPath, Field, FieldValues} from './types';
import {cloneObject, isArray} from '../utils';

export function getField<T extends Field, P extends FieldPath<T>>(
  fieldName: P[] | P | undefined,
  current: T,
) {
  if (!fieldName) {
    return cloneObject(current);
  }

  if (isArray(fieldName)) {
    const values: FieldValues<T, P[]> = [];
    fieldName.map(_name => current[_name]);
    return cloneObject(values);
  }

  return cloneObject(current[fieldName]);
}
