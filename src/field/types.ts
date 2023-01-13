export type Field = Record<string, any>;

export type FieldPath<T extends Field> = `${keyof T & string}`;

export type FieldValue<
  T extends Field,
  P extends FieldPath<T> = FieldPath<T>,
> = T[P];

export type FieldValues<T extends Field, P extends FieldPath<T>[]> = {} & {
  [K in keyof P]: FieldValue<T, P[K]>;
};

export type SetField<T extends Field> = <P extends FieldPath<T>>(
  fieldName: P,
  value: FieldValue<T, P>,
) => void;

export type GetField<T extends Field> = {
  (): T;
  <P extends FieldPath<T>>(fieldName: P): FieldValue<T, P>;
  <P extends FieldPath<T>[]>(fieldName: P): FieldValues<T, P>;
};
