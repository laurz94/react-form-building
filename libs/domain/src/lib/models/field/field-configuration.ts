import { ControlTypeEnum } from 'src/lib/constants';
import { FieldValue } from './field-value';
import { Validator } from './validator';

export interface FieldConfiguration<T> {
  inputId: string;
  controlType: ControlTypeEnum;
  controlConfig: T;
  name: string;
  dataPath?: string[];
  value?: FieldValue;
  label?: string;
  isDisabled?: boolean;
  isHidden?: boolean;
  isRequired?: boolean;
  isReadonly?: boolean;
  hideLabel?: boolean;
  hint?: string;
  validators?: Validator[];

  onChanged?: (event: any) => void;
  onFocused?: (event: any) => void;
  onBlurred?: (event: any) => void;
}

export function getDefaultFieldConfiguration<T>(
  overrides: Partial<FieldConfiguration<T>>
): FieldConfiguration<T> {
  if (!overrides.inputId) {
    throw new Error(
      `[getDefaultFieldConfiguration] inputId is a required field. Making config for ${overrides.name}`
    );
  }
  if (!overrides.name) {
    throw new Error(
      `[getDefaultFieldConfiguration] name is a required field. Making config for ${overrides.inputId}`
    );
  }
  if (!overrides.controlType) {
    throw new Error(
      `[getDefaultFieldConfiguration] type is a required field. Making config for ${overrides.inputId}`
    );
  }

  return Object.assign(
    {
      inputId: overrides.inputId,
      controlType: overrides.controlType,
      controlConfig: overrides.controlConfig ?? {} as T,
      dataPath: overrides.dataPath ?? [overrides.name],
      name: overrides.name,
    },
    overrides
  );
}
