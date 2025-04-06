import { FieldValue } from './field-value';
import { ValidationError } from './validation-error';
import { ValidationMatcher } from './validation-matcher';

export interface Validator {
  error: ValidationError;
  matcher: ValidationMatcher;
  valueToMatch: FieldValue;
}
