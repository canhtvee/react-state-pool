export const cloneObject = <T>(value: T) =>
  JSON.parse(JSON.stringify(value)) as T;
