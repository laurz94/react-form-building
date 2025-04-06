import { FieldType } from './field-type';
import { FieldValue } from './field-value';
import { Validator } from './validator';

export interface FieldConfiguration<T> {
  id: string;
  type: typeof FieldType;
  controlConfig: T;
  dataPath: string[];
  name: string;
  value: FieldValue;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  hideLabel?: boolean;
  hint?: string;
  validators?: Validator[];
}

export function getDefaultFieldConfiguration<T>(overrides?: Partial<FieldConfiguration<T>>): FieldConfiguration<T> {
    return Object.assign({
        id: '',
        type: FieldType.checkbox,
        controlConfig: {} as T,
        dataPath: [],
        name: '',
        value: ''
    }, overrides);
}
