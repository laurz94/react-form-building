import { ReadonlyFieldConfiguration } from './control-configurations';
import { FieldConfiguration } from './field/field-configuration';
import { FieldRule } from './field/field-rule';
import { FormLevel } from './form-level'; // Ensure FormLevel is correctly imported and typed
import { SectionConfiguration } from './section.configuration';

export type FormFieldType = FieldConfiguration<any> | SectionConfiguration | ReadonlyFieldConfiguration;
export interface FormConfiguration {
  /**
   * * The name of the form. This is used to identify the form in the application.
   * * It should be unique within the application.
   */
  name: string;
  /**
   * * The title of the form. This is used to display the title of the form in the UI.
   * * It should be a descriptive title that reflects the purpose of the form.
   */
  title: string;
  /**
   * * The level of the form.
   * * Options are: page, section, subSection.
   * * This is used to determine the layout of the form.
   */
  level: FormLevel;
  /**
   * * The sections, subsections, and fields of the form.
   *   This is an array of SectionConfiguration | FieldConfiguration | ReadonlyFieldConfiguration objects.
   */
  fields?: FormFieldType[];
  /**
   * * The field rules of the form. Goes Cross-Section.
   * * This is an array of FieldRule objects.
   * * These rules are used to cross-validate the fields in the form.
   */
  fieldRules?: FieldRule[];
}

export const getDefaultFormConfiguration = (overrides?: Partial<FormConfiguration>): FormConfiguration => {
  return Object.assign({
    name: 'default-form',
    title: 'Default Form',
    level: FormLevel.page,
    fieldRules: [],
    fields: [],
  }, overrides);
}