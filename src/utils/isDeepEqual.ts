import {isDate} from './isDate';
import {isPrimitive} from './isPrimitive';

export function isDeepEqual(value1: any, value2: any): boolean {
  if (isPrimitive(value1) || isPrimitive(value2)) {
    return value1 === value2;
  }

  if (isDate(value1) && isDate(value2)) {
    return value1.getTime() === value2.getTime();
  }

  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    const val1 = value1[key];
    const val2 = value2[key];
    if (!isDeepEqual(val1, val2)) {
      return false;
    }
  }
  return true;
}
