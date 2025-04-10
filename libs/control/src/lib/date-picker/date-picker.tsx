import { FieldConfiguration } from '@libs/domain';
import { useState } from 'react';
import '../global.css';
import { DatePickerConfiguration } from './date-picker.configuration';

export function LibDatePicker({
  config,
  initialValue,
  className,
  onBlurred,
  onChanged,
  onFocused,
}: {
  config: FieldConfiguration<DatePickerConfiguration>;
  initialValue: string | number | undefined;
  className: string;
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

  return (
    <input
      type="date"
      id={config.inputId + '-date-picker'}
      data-testid={config.inputId + '-date-picker'}
      className={'form-control ' + className}
      disabled={config.isDisabled}
      min={config.controlConfig.minDate}
      max={config.controlConfig.maxDate}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  );
}

export default LibDatePicker;
