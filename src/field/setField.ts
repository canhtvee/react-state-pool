import {FieldValues, FieldPath, FieldPathValue} from 'react-hook-form';
import {cloneObject} from '../utils';

export function setField<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(fields: T, path: P, value: FieldPathValue<T, P>) {
  fields[path] = cloneObject(value);
}
