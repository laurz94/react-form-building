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
  TextboxConfiguration,
} from '../models';
import { isFunction } from './object-manipulation';

export function processFieldRules(
  event: FieldRuleProcessEvent,
  configs: FormFieldType[],
  fieldRules: FieldRule[],
  data?: any
): FormFieldType[] {
  let newConfigs = [...configs];

  fieldRules
    .filter((r) => r.fieldName === event.fieldName)
    .forEach((fieldRule) => {
      if (
        event.value === fieldRule.valueToMatch &&
        fieldRule.updateOn === event.action
      ) {
        newConfigs = configs.map(
          (config): FieldConfiguration<any> => {
            const effectedField = fieldRule.effectedFields.find(
              (field) => field.name === config.name
            );

            return effectedField
              ? applyFieldRule(effectedField.actions, config, data)
              : { ...config };
          }
        );
      }
    });

  return newConfigs;
}

function applyFieldRule(
  actions: FieldRuleAction[],
  config: FieldConfiguration<any>,
  data?: any
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
        (newConfig.controlConfig as NumberConfiguration).min =
          getActionValue(action);
        break;
      case 'setMax':
        (newConfig.controlConfig as NumberConfiguration).max =
          getActionValue(action);
        break;
      case 'setMinDate':
        (newConfig.controlConfig as DatePickerConfiguration).minDate =
          getActionValue(action);
        break;
      case 'setMaxDate':
        (newConfig.controlConfig as DatePickerConfiguration).maxDate =
          getActionValue(action);
        break;
      case 'setMinLength':
        (newConfig.controlConfig as TextboxConfiguration).minLength =
          getActionValue(action);
        break;
      case 'setMaxLength':
        (newConfig.controlConfig as TextboxConfiguration).maxLength =
          getActionValue(action);
        break;
      case 'setValue':
        newConfig.value = getActionValue(action);
        break;
      case 'setPattern':
        (newConfig.controlConfig as TextboxConfiguration).pattern =
          getActionValue(action);
        break;
      case 'setOptions':
        (
          newConfig.controlConfig as
            | DropdownConfiguration
            | CheckboxConfiguration
        ).options = getActionValue(action);
        break;
      default:
        break;
    }
  });

  return newConfig;
}
