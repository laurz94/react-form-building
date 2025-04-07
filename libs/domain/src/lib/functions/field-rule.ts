import {
  CheckboxConfiguration,
  DatePickerConfiguration,
  DropdownConfiguration,
  FieldConfiguration,
  FieldRule,
  FieldRuleAction,
  FieldRuleProcessEvent,
  NumberConfiguration,
  TextboxConfiguration,
} from '../models';
import { isFunction } from './object-manipulation';

export function processFieldRules(
  event: FieldRuleProcessEvent,
  fieldConfigs: FieldConfiguration<BaseFieldConfiguration>[],
  fieldRules: FieldRule[],
  data?: any
): FieldConfiguration<any>[] {
  let newFieldConfigs = [...fieldConfigs];

  fieldRules
    .filter((r) => r.fieldName === event.fieldName)
    .forEach((fieldRule) => {
      if (
        event.value === fieldRule.valueToMatch &&
        fieldRule.updateOn === event.action
      ) {
        newFieldConfigs = fieldConfigs.map(
          (config): FieldConfiguration<BaseFieldConfiguration> => {
            const effectedField = fieldRule.effectedFields.find(
              (field) => field.name === config.controlConfig.name
            );

            return effectedField
              ? applyFieldRule(effectedField.actions, config, data)
              : { ...config };
          }
        );
      }
    });

  return newFieldConfigs;
}

function applyFieldRule(
  actions: FieldRuleAction[],
  config: FieldConfiguration<BaseFieldConfiguration>,
  data?: any
): FieldConfiguration<any> {
  const newConfig = { ...config, controlConfig: { ...config.controlConfig } };

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
        (newConfig.controlConfig as NumberConfiguration).min = isFunction(
          action.value
        )
          ? action.value(data)
          : action.value;
        break;
      case 'setMax':
        (newConfig.controlConfig as NumberConfiguration).max = isFunction(
          action.value
        )
          ? action.value(data)
          : action.value;
        break;
      case 'setMinDate':
        (newConfig.controlConfig as DatePickerConfiguration).minDate =
          isFunction(action.value) ? action.value(data) : action.value;
        break;
      case 'setMaxDate':
        (newConfig.controlConfig as DatePickerConfiguration).maxDate =
          isFunction(action.value) ? action.value(data) : action.value;
        break;
      case 'setMinLength':
        (newConfig.controlConfig as TextboxConfiguration).minLength =
          isFunction(action.value) ? action.value(data) : action.value;
        break;
      case 'setMaxLength':
        (newConfig.controlConfig as TextboxConfiguration).maxLength =
          isFunction(action.value) ? action.value(data) : action.value;
        break;
      case 'setValue':
        newConfig.value = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      case 'setPattern':
        (newConfig.controlConfig as TextboxConfiguration).pattern = isFunction(
          action.value
        )
          ? action.value(data)
          : action.value;
        break;
      case 'setOptions':
        (
          newConfig.controlConfig as
            | DropdownConfiguration
            | CheckboxConfiguration
        ).options = isFunction(action.value)
          ? action.value(data)
          : action.value;
        break;
      default:
        break;
    }
  });

  return newConfig;
}
