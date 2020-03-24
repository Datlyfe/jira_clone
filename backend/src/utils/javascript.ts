export const pick = <T extends Record<any, any>>(
  object: T,
  keys: string[]
): Partial<T> => {
  return keys.reduce((obj: any, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
