import { FieldConfiguration, NumberConfiguration } from '@libs/domain';
import { useState } from 'react';
import styles from './number.module.css';

export function LibNumber({
  config,
  initialValue,
  className,
  onBlurred,
  onChanged,
  onFocused,
}: {
  config: FieldConfiguration<NumberConfiguration>;
  className: string;
  initialValue?: number;
  /**
   * Use this event to validate the field
   * @param event The HTML blur event from the DOM
   * @param value The value of the control
   * @returns
   */
  onBlurred?: (value: string | number) => void;
  onChanged?: (value: string | number) => void;
  onFocused?: (value: string | number) => void;
}) {
  const [value, setValue] = useState(initialValue ?? '');

  const handleBlur = () => {
    if (onBlurred) {
      onBlurred(value);
    }
  };
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setValue(newValue);

    if (onChanged) {
      onChanged(newValue);
    }
  };
  const handleFocus = () => {
    if (onFocused) {
      onFocused(value);
    }
  };

  return config.controlConfig.isCurrency || config.controlConfig.prefix ? (
    <div className={`${styles['input-group']} ${['prefix']}`}>
      <span className={styles['input-group-addon']}>
        {config.controlConfig.isCurrency ? '$' : config.controlConfig.prefix}
      </span>
      <input
        type="number"
        id={config?.inputId + '-number'}
        data-testid={config.inputId + '-number'}
        className={'form-control ' + className}
        disabled={config.isDisabled}
        min={config.controlConfig.min ?? 0}
        max={config.controlConfig.max ?? undefined}
        placeholder={config.controlConfig.placeholder}
        step={config.controlConfig.step ?? 1}
        prefix="$"
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </div>
  ) : (
    <input
      type="number"
      id={config.inputId + '-number'}
      data-testid={config.inputId + '-number'}
      className={'form-control ' + className}
      disabled={config.isDisabled}
      min={config.controlConfig.min ?? 0}
      max={config.controlConfig.max ?? undefined}
      placeholder={config.controlConfig.placeholder}
      step={config.controlConfig.step ?? 1}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  );
}

export default LibNumber;
