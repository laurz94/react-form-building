import { FieldConfiguration } from './field/field-configuration';
import { FieldRule } from './field/field-rule';
import { FormLevel } from './form-level';

export interface FormConfiguration {
  name: string;
  title: string;
  level: typeof FormLevel;
  fields: FieldConfiguration<any>[];
  fieldRules: FieldRule[];
}
