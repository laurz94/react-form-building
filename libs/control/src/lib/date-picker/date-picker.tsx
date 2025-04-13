import { DatePickerConfiguration, FieldConfiguration } from '@libs/domain';
import { useState } from 'react';
import '../global.css';

/**
 * A reusable date picker component for forms, allowing users to select a date.
 *
 * @param config - The configuration object for the date picker, including field settings and constraints.
 * @param config.inputId - The unique identifier for the input element.
 * @param config.isDisabled - A flag indicating whether the date picker is disabled.
 * @param config.controlConfig.minDate - The minimum selectable date.
 * @param config.controlConfig.maxDate - The maximum selectable date.
 * @param initialValue - The initial value of the date picker, which can be a string or number.
 * @param className - Additional CSS classes to apply to the input element.
 * @param onBlurred - Callback triggered when the input loses focus. Receives the current value as a parameter.
 * @param onChanged - Callback triggered when the input value changes. Receives the new value as a parameter.
 * @param onFocused - Callback triggered when the input gains focus. Receives the current value as a parameter.
 *
 * @returns A date picker input element with configurable properties and event handlers.
 */
export function LibDatePicker({
  config,
  initialValue,
  className,
  onBlurred,
  onChanged,
  onFocused,
}: {
  config: FieldConfiguration<DatePickerConfiguration>;
  initialValue?: string | number | undefined;
  className?: string;
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
