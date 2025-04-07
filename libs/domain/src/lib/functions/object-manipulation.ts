export function isFunction(value: any){
  return typeof value === 'function';
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createNestedObject(
  obj: Record<string, any>
): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const keys = key.split('.');
    keys.reduce((nested: { [key: string]: any }, k, i) => {
      // is the last key of the object?
      if (i === keys.length - 1) {
        // yes - look for another an array of object
        if (Array.isArray(obj[key])) {
          nested[k] = obj[key].map((value) => createNestedObject(value));
        } else {
          // otherwise, set the value
          nested[k] = obj[key];
        }
      } else {
        // no - keeping building the object structure
        nested[k] = nested[k] || {};
      }
      return nested[k];
    }, acc);
    return acc;
  }, {});
}
