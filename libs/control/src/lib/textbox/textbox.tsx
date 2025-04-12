import { FieldConfiguration, TextboxConfiguration } from '@libs/domain';
import { useState } from 'react';
import '../global.css';

export function LibTextbox({
  config,
  initialValue,
  className,
  onBlurred,
  onChanged,
  onFocused,
}: {
  config: FieldConfiguration<TextboxConfiguration>;
  initialValue?: string;
  className: string;
  /**
   * Use this event to validate the field
   * @param event The HTML blur event from the DOM
   * @param value The value of the control
   * @returns
   */
  onBlurred?: (value: string) => void;
  onChanged?: (value: string) => void;
  onFocused?: (value: string) => void;
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
      type='text'
      id={config.inputId + '-textbox'}
      data-testid={config.inputId + '-textbox'}
      className={'form-control ' + (className ?? '')}
      disabled={config.isDisabled}
      minLength={config.controlConfig?.minLength}
      maxLength={config.controlConfig?.maxLength}
      pattern={config.controlConfig?.pattern ? config.controlConfig.pattern.toString() : undefined}
      placeholder={config.controlConfig?.placeholder}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onInput={config.controlConfig?.onInput}></input>
  );
}

export default LibTextbox;
