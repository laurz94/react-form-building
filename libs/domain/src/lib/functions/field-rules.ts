import {
  CheckboxConfiguration,
  DatePickerConfiguration,
  DropdownConfiguration,
  FieldConfiguration,
  FieldRule,
  FieldRuleAction,
  FieldRuleProcessEvent,
  FormFieldType,
  NumberConfiguration,
  ReadonlyFieldConfiguration,
  SectionConfiguration,
  TextboxConfiguration,
} from '../models';
import { isFunction } from './object-manipulation';

export function processFieldRules(
  event: FieldRuleProcessEvent,
  fieldConfigs: FormFieldType[],
  fieldRules: FieldRule[],
  data?: any,
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
            data ?? { [event.fieldName]: event.value },
          );
        });
      }
    });

  return newFieldConfigs;
}

const doesEventValueMatch = (event: FieldRuleProcessEvent, fieldRule: FieldRule) => {
  let eventMatches = false;
  if (fieldRule.valueToMatch === '*') {
    eventMatches = true;
  } else if (isFunction(fieldRule.valueToMatch)) {
    eventMatches = (fieldRule.valueToMatch as any)(event.value);
  } else if (Array.isArray(fieldRule.valueToMatch)) {
    eventMatches = !!(fieldRule.valueToMatch as any[]).find((value) => event.value === value);
  } else {
    eventMatches = event.value === fieldRule.valueToMatch;
  }

  return eventMatches && (fieldRule.updateOn === event.action || fieldRule.updateOn === 'onLoad');
};

const isSectionConfig = (config: FormFieldType) => !!(config as SectionConfiguration).fields;

function findEffectedSectionConfigurationApplyRule(
  config: FormFieldType,
  fieldRule: FieldRule,
  data: any,
): FormFieldType {
  return isSectionConfig(config)
    ? {
        ...config,
        fields: (config as SectionConfiguration).fields?.map((config) =>
          findEffectedSectionConfigurationApplyRule(config as SectionConfiguration, fieldRule, data),
        ),
      }
    : findEffectedFieldConfigurationApplyRule(
        fieldRule,
        config as FieldConfiguration<any> | ReadonlyFieldConfiguration,
        data,
      );
}

function findEffectedFieldConfigurationApplyRule(
  fieldRule: FieldRule,
  config: FieldConfiguration<any> | ReadonlyFieldConfiguration,
  data: any,
): FieldConfiguration<any> | ReadonlyFieldConfiguration {
  const effectedField = fieldRule.effectedFields.find((field) => {
    return (
      field.name === (config as FieldConfiguration<any>).name ||
      field.name === (config as ReadonlyFieldConfiguration).inputId
    );
  });

  return effectedField ? applyFieldRule(effectedField.actions, config as FieldConfiguration<any>, data) : { ...config };
}

function applyFieldRule(
  actions: FieldRuleAction[],
  config: FieldConfiguration<any>,
  data?: any,
): FieldConfiguration<any> {
  const newConfig = { ...config, controlConfig: { ...config.controlConfig } };

  function getActionValue(action: FieldRuleAction) {
    return action.value
      ? isFunction(action.value)
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          (action.value as Function)(data)
        : typeof action.value === 'number'
        ? +action.value
        : action.value
      : undefined;
  }

  actions.forEach((action) => {
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
        newConfig.isDisabled = true;
        break;
      case 'enable':
        newConfig.isDisabled = false;
        break;
      case 'readonly':
        newConfig.isReadonly = true;
        break;
      case 'editable':
        newConfig.isReadonly = false;
        break;
      case 'setMin':
        (newConfig.controlConfig as NumberConfiguration).min = getActionValue(action);
        break;
      case 'setMax':
        (newConfig.controlConfig as NumberConfiguration).max = getActionValue(action);
        break;
      case 'setMinDate':
        (newConfig.controlConfig as DatePickerConfiguration).minDate = getActionValue(action);
        break;
      case 'setMaxDate':
        (newConfig.controlConfig as DatePickerConfiguration).maxDate = getActionValue(action);
        break;
      case 'setMinLength':
        (newConfig.controlConfig as TextboxConfiguration).minLength = getActionValue(action);
        break;
      case 'setMaxLength':
        (newConfig.controlConfig as TextboxConfiguration).maxLength = getActionValue(action);
        break;
      case 'setValue':
        newConfig.value = getActionValue(action);
        break;
      case 'setLabel':
        newConfig.label = getActionValue(action);
        break;
      case 'setPattern':
        (newConfig.controlConfig as TextboxConfiguration).pattern = getActionValue(action);
        break;
      case 'setOptions':
        (newConfig.controlConfig as DropdownConfiguration | CheckboxConfiguration).options = getActionValue(action);
        break;
      default:
        break;
    }
  });

  return newConfig;
}
