export type FieldType = Record<string, any>;

export type FieldPathType<T extends FieldType> = `${keyof T & string}`;

export type FieldValueType<T extends FieldType> = T[FieldPathType<T>];

export type PartialFieldType<T extends FieldType> = {
  [P in FieldPathType<T>]?: T[P];
};

export type RoomType<T extends FieldType> = {
  set: (fieldName: FieldPathType<T>, value: FieldValueType<T>) => void;
  getAll: () => any;
  getSingle: (fieldName: FieldPathType<T>) => any;
  getMultiple: (fieldName: Array<FieldPathType<T>>) => any;
  resetContext: () => void;
};
