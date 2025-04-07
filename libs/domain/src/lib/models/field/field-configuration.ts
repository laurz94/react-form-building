import { FieldType } from './field-type';
import { FieldValue } from './field-value';
import { Validator } from './validator';

export interface FieldConfiguration<T> {
  id: string;
  type: typeof FieldType;
  controlConfig: T;
  dataPath: string[];
  name: string;
  value?: FieldValue;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  hideLabel?: boolean;
  hint?: string;
  validators?: Validator[];

  onChanged?: (event: any) => void;
  onFocused?: (event: any) => void;
  onBlurred?: (event: any) => void;
}

export function getDefaultFieldConfiguration<T>(overrides: Partial<FieldConfiguration<T>>): FieldConfiguration<T> {
    if(!overrides.inputId) {
    throw new Error(`[getDefaultFieldConfiguration] inputId is a required field. Making config for ${overrides.name}`);
  }
  if(!overrides.name) {
    throw new Error(`[getDefaultFieldConfiguration] name is a required field. Making config for ${overrides.inputId}`);
  }
  if(!overrides.type) {
    throw new Error(`[getDefaultFieldConfiguration] type is a required field. Making config for ${overrides.inputId}`);
  }
  if(!overrides.controlConfig) {
    throw new Error(`[getDefaultFieldConfiguration] controlConfig is a required field. Making config for ${overrides.inputId}`);
  }
  if(!overrides.dataPath?.length) {
    throw new Error(`[getDefaultFieldConfiguration] dataPath is a required field. Making config for ${overrides.inputId}`);
  }
  
    return Object.assign({
        id: '',
        type: overrides?.type,
        controlConfig: {} as T,
        dataPath: [],
        name: ''
    }, overrides);
}
