import {
  FieldConfiguration,
  FieldRule,
  FieldRuleUpdateEvent,
  processFieldRules,ReadonlyFieldConfiguration
} from '@libs/domain';
import { useState } from 'react';
import Field from '../field/field';
import Section, { SectionConfiguration } from '../section/section';
import ReadonlyField from '../readonly-field/readonly-field';

export function LibForm({
  fields,
  fieldRules,
  sectionConfig,
  onBlurred,
  onChanged,
  onFocused,
}: {
  fields: (
    | FieldConfiguration<any>
    | SectionConfiguration
    | ReadonlyFieldConfiguration
  )[];
  fieldRules?: FieldRule[];
  sectionConfig?: SectionConfiguration;
  onBlurred?: (value: string | number) => void;
  onChanged?: (value: string | number, fieldName: string) => void;
  onFocused?: (value: string | number) => void;
}) {
  const [configs, setConfigs] = useState(fields);

  const handleBlur = (value: any, fieldName: string) => {
    // TODO: If we have cross field validations, it should happen here
    // validate(value);
    processRules(value, fieldName, 'onBlur');

    if (onBlurred) {
      onBlurred(value);
    }
  };

  const handleChange = (value: any, fieldName: string) => {
    processRules(value, fieldName, 'onChange');

    if (onChanged) {
      onChanged(value, fieldName);
    }
  };

  function processRules(
    value: any,
    fieldName: string,
    action: FieldRuleUpdateEvent
  ) {
    if (fieldRules?.length) {
      const newConfigs = processFieldRules(
        { fieldName, value, action: action },
        configs as FieldConfiguration<any>[],
        fieldRules
      );

      setConfigs(newConfigs);
    }
  }

  const isSection = (
    field:
      | FieldConfiguration<any>
      | ReadonlyFieldConfiguration
      | SectionConfiguration
  ): boolean => {
    return !!(field as any).fields?.length;
  };

  const renderFields = (
    fieldConfigs: (
      | FieldConfiguration<any>
      | ReadonlyFieldConfiguration
      | SectionConfiguration
    )[]
  ) => {
    return fieldConfigs.map((field) => {
      return isSection(field) ? (
        <Section
          key={(field as SectionConfiguration).inputId}
          {...(field as SectionConfiguration)}
        >
          {renderFields((field as any as SectionConfiguration).fields!)}
        </Section>
      ) : (field as FieldConfiguration<any>).controlConfig?.inputId ? (
        <Field
          key={
            (field as FieldConfiguration<any>).controlConfig?.inputId ??
            (field as any as ReadonlyFieldConfiguration).inputId
          }
          config={field as FieldConfiguration<any>}
          onBlurred={handleBlur}
          onChanged={handleChange}
        ></Field>
      ) : (
        <ReadonlyField
          {...(field as ReadonlyFieldConfiguration)}
        ></ReadonlyField>
      );
    });
  };

  return (
    <form className="form">
      {sectionConfig ? (
        <Section {...sectionConfig}>{renderFields(configs)}</Section>
      ) : (
        renderFields(configs)
      )}
    </form>
  );
}
export default LibForm;
