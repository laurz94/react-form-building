import {
  FieldConfiguration,
  FieldRuleUpdateEvent,
  FormConfiguration,
  FormFieldType,
  FormLevel,
  processFieldRules,
  ReadonlyFieldConfiguration,
  SectionConfiguration,
} from '@libs/domain';
import { useState } from 'react';
import Field from '../field/field';
import ReadonlyField from '../readonly-field/readonly-field';
import Section from '../section/section';

export function LibForm(
  { name, title, level, fields, fieldRules, onBlurred, onChanged }: FormConfiguration,
) {
  const [configs, setConfigs] = useState(fields);

  const handleBlur = (value: any, fieldName: string) => {
    // Cross field validations
    processRules(value, fieldName, FieldRuleUpdateEvent.onBlur);

    if (onBlurred) {
      onBlurred(value);
    }
  };

  const handleChange = (value: any, fieldName: string) => {
    processRules(value, fieldName, FieldRuleUpdateEvent.onChange);

    if (onChanged) {
      onChanged(value, fieldName);
    }
  };

  function processRules(value: any, fieldName: string, action: FieldRuleUpdateEvent) {
    if (fieldRules?.length) {
      const newConfigs = processFieldRules(
        { fieldName, value, action: action },
        configs,
        fieldRules,
      );

      setConfigs(newConfigs);
    }
  }

  const isSection = (field: FormFieldType): boolean => {
    return typeof level === typeof FormLevel.section || typeof level === typeof FormLevel.subSection;
  };

  const renderFields = (fieldConfigs: FormFieldType[]) => {
    return fieldConfigs.map((field) => {
      return isSection(field) ? (
        <Section key={(field as SectionConfiguration).inputId} {...(field as SectionConfiguration)}>
          {renderFields((field as any as SectionConfiguration).fields!)}
        </Section>
      ) : (field as FieldConfiguration<any>)?.controlType ? (
        <Field
          key={(field as FieldConfiguration<any>)?.inputId ?? (field as any as ReadonlyFieldConfiguration).inputId}
          config={field as FieldConfiguration<any>}
          onBlurred={handleBlur}
          onChanged={handleChange}></Field>
      ) : (
        <ReadonlyField
          {...(field as ReadonlyFieldConfiguration)}
          key={(field as ReadonlyFieldConfiguration).inputId}></ReadonlyField>
      );
    });
  };

  return (
    <form role='form' className='form' id={name + '-form'} name={name} data-testid={name + '-form'}>
      {typeof level === typeof FormLevel.page && <h1 className='form-title'>{title ?? 'PAGE TITLE'}</h1>}
      <main className='form-body'>{renderFields(configs as FormFieldType[])}</main>
      {/* {typeof level === typeof FormLevel.section && <Section {...sectionConfig}>{renderFields(configs)}</Section>} */}
      {/* {sectionConfig ? <Section {...sectionConfig}>{renderFields(configs)}</Section> : renderFields(configs)} */}
    </form>
  );
}
export default LibForm;
