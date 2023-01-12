import {isNullOrUndefined} from './isNullOrUndefined';

export const isObjectType = (value: unknown) => typeof value === 'object';

export const isObject = (value: unknown) =>
  !isNullOrUndefined(value) &&
  !Array.isArray(value) &&
  isObjectType(value) &&
  !(value instanceof Date);
