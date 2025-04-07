import { Validator } from '../models';

export function customValidator(
  { error, valueToMatch, matcher }: Validator,
  value: boolean | string | number | string[]
) {
  let isInvalid = false;

  switch (matcher) {
    case 'equal':
      isInvalid = value === valueToMatch;
      break;
    case 'greaterThan':
      isInvalid = value > valueToMatch;
      break;
    case 'lessThan':
      isInvalid = value < valueToMatch;
      break;
    case 'between':
      if (Array.isArray(valueToMatch)) {
        isInvalid = value > valueToMatch[0] && value < valueToMatch[1];
      }
      break;
    case 'includes':
      if (typeof value === 'string' || Array.isArray(value)) {
        if (typeof valueToMatch === 'string') {
          isInvalid = value.includes(valueToMatch);
        } else if (Array.isArray(valueToMatch)) {
          isInvalid = valueToMatch.reduce((previousValue, currentValue) => {
            return value.includes(currentValue);
          }, isInvalid);
        }
      }
  }

  return isInvalid ? error : undefined;
}
