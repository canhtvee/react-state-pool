import {FieldPath, FieldValues} from 'react-hook-form';
import {cloneObject, isArray} from '../utils';

export function getField<T extends FieldValues, P extends FieldPath<T>>(
  fields: T,
  path: P[] | P | undefined,
) {
  if (!path) {
    return cloneObject(fields);
  }

  if (isArray(path)) {
    const values = path.map(_path => fields[_path]);
    return cloneObject(values);
  }

  return cloneObject(fields[path]);
}
