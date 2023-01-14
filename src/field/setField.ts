import {cloneObject} from '../utils';

import {FieldPath, Field, FieldValue} from './types';

export function setField<T extends Field>(
  fieldName: FieldPath<T>,
  value: FieldValue<T, FieldPath<T>>,
  current: T,
) {
  current[fieldName] = cloneObject(value);
}
