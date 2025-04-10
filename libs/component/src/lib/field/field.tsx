import {
  customValidator,
  FieldConfiguration,
  validateField,
  ControlTypeEnum,
  DropdownConfiguration,
} from '@libs/domain';
import { useState } from 'react';
import { ReadonlyField } from '../readonly-field';
import styles from './field.module.css';
import { LibDatePicker, LibNumber, LibTextbox } from '@libs/control';

export function Field({
  config,
  onBlurred,
  onChanged,
  onFocused,
}: {
  config: FieldConfiguration<any>;
  onBlurred?: (value: string | number, fieldName: string) => void;
  onChanged?: (value: string | number, fieldName: string) => void;
  onFocused?: (value: string | number) => void;
}) {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (value: any) => {
    const validationErrors = validateField(config, value);

    if (config.validators?.length) {
      config.validators.forEach((validator) => {
        const error = customValidator(validator, value);
        if (error) {
          validationErrors.push(error.message);
        }
      });
    }

    setErrors(validationErrors);
  };

  const handleBlur = (value: any) => {
    validate(value);

    if (onBlurred) {
      onBlurred(value, (config.controlConfig as any).name);
    }
  };

  const handleChange = (value: any) => {
    validate(value);

    if (onChanged) {
      onChanged(value, (config.controlConfig as any).name);
    }
  };

  const handleFocus = (value?: any) => {
    if (onFocused) {
      onFocused(value);
    }
  };

  return config.isHidden ? (
    <></>
  ) : config.isReadonly ? (
    <ReadonlyField
      inputId={config.controlConfig.inputId}
      label={config.label ?? ''}
      value={config.value}
      hideLabel={config.hideLabel}
      hint={config.hint}
      key={config.controlConfig.inputId}
      isCurrency={config.controlType === ControlTypeEnum.Number}
      valueClassName={config.className}
    ></ReadonlyField>
  ) : (
    <div
      id={config.controlConfig.inputId + '-field'}
      data-testid={config.controlConfig.inputId + '-field'}
      className={`${styles['field']} ${config.className ?? ''}`}
    >
      {!config.hideLabel && (
        <label
          className={styles['label']}
          data-testid={config.controlConfig.inputId + '-field-label'}
        >
          {' '}
          {config.label}
          {config.isRequired && <span className={styles['required']}> *</span>}
          {!config.isRequired && (
            <span className={styles['optional']}> (Optional)</span>
          )}
        </label>
      )}

      {config.controlType === ControlTypeEnum.DatePicker && (
        <LibDatePicker
          key={config.controlConfig.inputId}
          config={config.controlConfig}
          initialValue={config.value}
          className={errors.length ? 'invalid' : 'valid'}
          onBlurred={handleBlur}
          onChanged={handleChange}
          onFocused={handleFocus}
        ></LibDatePicker>
      )}
{/* 
      {config.controlType === ControlTypeEnum.Dropdown && (
        <LibDropdown
          key={config.controlConfig.inputId}
          config={(config.controlConfig as DropdownConfiguration)}
          initialValue={config.value}
          className={errors.length ? 'invalid' : 'valid'}
          onBlurred={handleBlur}
          onChanged={handleChange}
          onFocused={handleFocus}
        ></LibDropdown>
      )}
 */}
      {config.controlType === ControlTypeEnum.Number && (
        <LibNumber
          key={config.controlConfig.inputId}
          config={config.controlConfig}
          initialValue={config.value}
          className={errors.length ? 'invalid' : 'valid'}
          onBlurred={handleBlur}
          onChanged={handleChange}
          onFocused={handleFocus}
        ></LibNumber>
      )}
{/* 
      {config.controlType === ControlTypeEnum.SelectButton && (
        <LibSelectButton
          key={config.controlConfig.inputId}
          config={(config.controlConfig) as SelectButtonConfiguration}
          initialValue={config.value}
          className={errors.length ? 'invalid' : 'valid'}
          onBlurred={handleBlur}
          onChanged={handleChange}
          onFocused={handleFocus}
        ></LibSelectButton>
      )}
 */}
      {config.controlType === ControlTypeEnum.Textbox && (
        <LibTextbox
          key={config.controlConfig.inputId}
          config={config.controlConfig}
          initialValue={config.value}
          className={errors.length ? 'invalid' : 'valid'}
          onBlurred={handleBlur}
          onChanged={handleChange}
          onFocused={handleFocus}
        ></LibTextbox>
      )}

      {config.hint && (
        <small
          data-testid={config.controlConfig.inputId + '-field-hint'}
          className={styles['hint']}
        >
          {config.hint}
        </small>
      )}

      {errors.map((error, i) => (
        <small
          data-testid={`${config.controlConfig.inputId}-field-error-${i}`}
          key={i}
          className={styles['validation-message']}
        >
          {error}
        </small>
      ))}
    </div>
  );
}

export default Field;
