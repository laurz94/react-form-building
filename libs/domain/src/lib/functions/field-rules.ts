import {
  BaseFieldConfiguration,
  FieldConfiguration,
  FieldRule,
  FieldRuleAction,
  FieldRuleProcessEvent,
  FormFieldType,
  ReadonlyFieldConfiguration,
  SectionConfiguration,
} from '../models';
import { isFunction } from './object-manipulation';

export function processFieldRules(
  event: FieldRuleProcessEvent,
  fieldConfigs: FormFieldType[],
  fieldRules: FieldRule[],
  data?: any
): FormFieldType[] {
  let newFieldConfigs: FormFieldType[] = [...fieldConfigs];

  fieldRules
    .filter((r) => r.fieldName === event.fieldName)
    .forEach((fieldRule) => {
      if (doesEventValueMatch(event, fieldRule)) {
        newFieldConfigs = fieldConfigs.map((config) => {
          return findEffectedSectionConfigurationApplyRule(
            config,
            fieldRule,
            data ?? { [event.fieldName]: event.value }
          );
        });
      }
    });

  return newFieldConfigs;
}

const doesEventValueMatch = (
  event: FieldRuleProcessEvent,
  fieldRule: FieldRule
) => {
  let eventMatches = false;
  if (fieldRule.valueToMatch === '*') {
    eventMatches = true;
  } else if (isFunction(fieldRule.valueToMatch)) {
    eventMatches = (fieldRule.valueToMatch as any)(event.value);
  } else if (Array.isArray(fieldRule.valueToMatch)) {
    eventMatches = !!(fieldRule.valueToMatch as any[]).find(
      (value) => event.value === value
    );
  } else {
    eventMatches = event.value === fieldRule.valueToMatch;
  }

  return (
    eventMatches &&
    (fieldRule.updateOn === event.action || fieldRule.updateOn === 'load')
  );
};

const isSectionConfig = (config: FormFieldType) =>
  !!(config as SectionConfiguration).fields;
function findEffectedSectionConfigurationApplyRule(
  config: FormFieldType,
  fieldRule: FieldRule,
  data: any
): FormFieldType {
  console.log('section effected');
  return isSectionConfig(config)
    ? {
        ...config,
        fields: (config as SectionConfiguration).fields?.map((config) =>
          findEffectedSectionConfigurationApplyRule(
            config as SectionConfiguration,
            fieldRule,
            data
          )
        ),
      }
    : findEffectedFieldConfigurationApplyRule(
        fieldRule,
        config as FieldConfiguration<any> | ReadonlyFieldConfiguration,
        data
      );
}

function findEffectedFieldConfigurationApplyRule(
  fieldRule: FieldRule,
  config: FieldConfiguration<any> | ReadonlyFieldConfiguration,
  data: any
): FieldConfiguration<any> | ReadonlyFieldConfiguration {
  const effectedField = fieldRule.effectedFields.find((field) => {
    console.log({ fieldRule, config });

    return (
      field.name === (config as FieldConfiguration<any>).controlConfig.name ||
      field.name === (config as ReadonlyFieldConfiguration).inputId
    );
  });

  return effectedField
    ? applyFieldRule(
        effectedField.actions,
        config as FieldConfiguration<any>,
        data
      )
    : { ...config };
}

function applyFieldRule(
  actions: FieldRuleAction[],
  config: FieldConfiguration<BaseFieldConfiguration>,
  data?: any
): FieldConfiguration<BaseFieldConfiguration> {
  const newConfig = { ...config, controlConfig: { ...config.controlConfig } };
  actions.forEach((action) => {
    console.log({ action, data });
    switch (action.action) {
      case 'show':
        newConfig.isHidden = false;
        break;
      case 'hide':
        newConfig.isHidden = true;
        break;
      case 'require':
        newConfig.isRequired = true;
        break;
      case 'optional':
        newConfig.isRequired = false;
        break;
      case 'disable':
        newConfig.controlConfig.isDisabled = true;
        break;
      case 'enable':
        newConfig.controlConfig.isDisabled = false;
        break;
      case 'readonly':
        newConfig.isReadonly = true;
        break;
      case 'editable':
        newConfig.isReadonly = false;
        break;
      case 'setMin':
        (newConfig.controlConfig as any).min = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setMax':
        (newConfig.controlConfig as any).max = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setMinDate':
        (newConfig.controlConfig as any).minDate = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setMaxDate':
        (newConfig.controlConfig as any).maxDate = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setMinLength':
        (newConfig.controlConfig as any).minLength = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setMaxLength':
        (newConfig.controlConfig as any).maxLength = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setValue':
        newConfig.value = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setLabel':
        newConfig.label = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setPattern':
        (newConfig.controlConfig as any).pattern = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setOptions':
        (newConfig.controlConfig as any).options = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      default:
        break;
    }
  });

  return newConfig;
}
