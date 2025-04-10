import {
    DatePickerConfiguration,
    DropdownConfiguration,
    NumberConfiguration,
    SelectButtonConfiguration,
    TextboxConfiguration,
} from '@libs/control';
import {
    BaseFieldConfiguration,
    CheckboxConfiguration,
    ControlTypeEnum,
    FieldConfiguration,
    Validator,
} from '@libs/domain';
import { fireEvent, render, screen } from '@testing-library/react';
import Field from './field';

describe('Field', () => {
  const handleBlur = jest.fn();
  const handleChange = jest.fn();
  const handleFocus = jest.fn();
  const inputId = 'test';
  const baseConfig: FieldConfiguration<BaseFieldConfiguration> = {
    controlType: ControlTypeEnum.Textbox,
    controlConfig: {
      inputId,
      name: inputId,
      isDisabled: false,
    },
    isRequired: true,
    isReadonly: false,
    label: 'First Name',
  };

  function getField(config: FieldConfiguration<BaseFieldConfiguration>) {
    render(
      <Field
        config={config}
        onChanged={handleChange}
        onBlurred={handleBlur}
        onFocused={handleFocus}
      />
    );

    return screen.getAllByTestId('test-field')?.[0];
  }

  describe('Labels and Hints', () => {
    it('display a label', async () => {
      const config = { ...baseConfig };
      const field = await getField(config);
      const label = field?.querySelector('.label');

      expect(label).toBeTruthy();
      expect(label).toMatchInlineSnapshot(`
              <label
                class="label"
                data-testid="test-field-label"
              >
                 
                First Name
                <span
                  class="required"
                >
                   *
                </span>
              </label>
          `);
    });
    it('display an empty label', async () => {
      const config = { ...baseConfig, label: undefined, isRequired: false };
      const field = await getField(config);
      const label = field?.querySelector('.label');

      expect(label).toBeTruthy();
      expect(label).toMatchInlineSnapshot(`
        <label
          class="label"
          data-testid="test-field-label"
        >
           
          <span
            class="optional"
          >
             (Optional)
          </span>
        </label>
      `);
    });
    it('hide a label', async () => {
      const config = { ...baseConfig, hideLabel: true };
      const field = await getField(config);
      const label = field?.querySelector('.label');

      expect(label).toBeFalsy();
    });
    it('display the optional label when field is not required', async () => {
      const config = { ...baseConfig, isRequired: false };
      const field = await getField(config);
      const optionalSpan = field?.querySelector('.optional');

      expect(optionalSpan).toBeTruthy();
      expect(optionalSpan).toMatchInlineSnapshot(`
              <span
                class="optional"
              >
                 (Optional)
              </span>
          `);
    });
    it('display a hint', async () => {
      const config = { ...baseConfig, hint: 'Please provide your legal name' };
      const field = await getField(config);
      const hint = field?.querySelector('.hint');

      expect(hint).toBeTruthy();
      expect(hint).toMatchInlineSnapshot(`
              <small
                class="hint"
                data-testid="test-field-hint"
              >
                Please provide your legal name
              </small>
          `);
    });
  });

  describe('Fires Events', () => {
    it('calls event handlers when input loses focus, blurs, and changes', () => {
      // Create the field on the DOM
      const field = getField(baseConfig);
      // Grab the input
      const inputElement = screen.getByRole('textbox');

      fireEvent.focus(inputElement);
      fireEvent.blur(inputElement);
      fireEvent.change(inputElement, { target: { value: 'George Brett' } });

      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(handleBlur).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Messages', () => {
    it('display an validation error when on blur is fired (empty value, field isRequired)', async () => {
      const field = getField(baseConfig);
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.blur(inputElement, { target: { value: '' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeTruthy();
      expect(errors).toMatchInlineSnapshot(`
        <small
          class="validation-message"
          data-testid="test-field-error-0"
        >
          First Name is a required field.
        </small>
      `);
    });
    it('display an validation error when on change is fired (empty value, field isRequired)', async () => {
      const field = getField({ ...baseConfig, value: 'George Brett' });
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: '' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeTruthy();
      expect(errors).toMatchInlineSnapshot(`
        <small
          class="validation-message"
          data-testid="test-field-error-0"
        >
          First Name is a required field.
        </small>
      `);
    });
    it('NOT display an validation error when on blur is fired (with value, field isRequired)', async () => {
      const field = getField({...baseConfig, value: 'George Brett'});
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.blur(inputElement, { target: { value: 'George Brett' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeFalsy();
    });
    it('NOT display an validation error when on change is fired (with value, field isRequired)', async () => {
      const field = getField(baseConfig);
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: 'George Brett' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeFalsy();
    });
    it('display a custom message when a customer validator is supplied and value matches', async () => {
      const validator: Validator = {
        error: { name: 'TestValidator', message: 'Test validation message' },
        matcher: 'equal',
        valueToMatch: 'George Brett',
      };
      const field = getField({ ...baseConfig, validators: [validator] });
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: 'George Brett' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeTruthy();
    });
    it('NOT display a custom message when a customer validator is supplied and value does NOT match', async () => {
      const validator: Validator = {
        error: { name: 'TestValidator', message: 'Test validation message' },
        matcher: 'equal',
        valueToMatch: 'George Brett',
      };
      const field = getField({ ...baseConfig, validators: [validator] });
      const inputElement = screen.getByRole('textbox');
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: 'Kim' } });
      const errors = field?.querySelector('.validation-message');

      expect(errors).toBeFalsy();
    });
  });

  describe('controls', () => {
    it('display a checkbox', async () => {
      const config: FieldConfiguration<CheckboxConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.Checkbox,
        controlConfig: {
          ...baseConfig.controlConfig,
          options: [
            {
              label: 'test',
              value: 'test',
            },
          ],
        },
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
        </div>
      `);
    });
    it('display a date-picker', async () => {
      const config: FieldConfiguration<DatePickerConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.DatePicker,
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
          <input
            class="form-control valid"
            data-testid="test-date-picker"
            id="test-date-picker"
            type="date"
            value=""
          />
        </div>
      `);
    });
    it('display a dropdown', async () => {
      const config: FieldConfiguration<DropdownConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.Dropdown,
        controlConfig: {
          ...baseConfig.controlConfig,
          options: [{ label: 'Test', value: 'test' }],
        },
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
          <div
            class="MuiSelect-root MuiSelect-variantSoft MuiSelect-colorNeutral MuiSelect-sizeMd form-control invalid css-x6wu8x-JoySelect-root"
          >
            <button
              aria-controls=":r0:"
              aria-expanded="false"
              class="MuiSelect-button css-me27eb-JoySelect-button"
              id="test-dropdown"
              name="test"
              role="combobox"
              type="button"
            />
            <span
              class="MuiSelect-indicator css-b0m4zx-JoySelect-indicator"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-sizeMd css-1r2bn3-JoySvgIcon-root"
                data-testid="UnfoldIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="m12 5.83 2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7a.9959.9959 0 0 0-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34-2.46-2.46a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L12 18.17z"
                />
              </svg>
            </span>
            <input
              aria-hidden="true"
              name="test"
              style="border: 0px; height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; white-space: nowrap; width: 1px;"
              tabindex="-1"
              value=""
            />
          </div>
          <small
            class="validation-message"
            data-testid="test-field-error-0"
          >
            First Name is a required field.
          </small>
        </div>
      `);
    });
    it('display a number', async () => {
      const config: FieldConfiguration<NumberConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.Number,
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
          <input
            class="form-control valid"
            data-testid="test-number"
            id="test-number"
            min="0"
            step="1"
            type="number"
            value=""
          />
        </div>
      `);
    });
    it('display a select-button', async () => {
      const config: FieldConfiguration<SelectButtonConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.SelectButton,
        controlConfig: {
          ...baseConfig.controlConfig,
          options: [{ label: 'Test', value: 'test' }],
        },
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
          <div
            class="MuiToggleButtonGroup-root MuiToggleButtonGroup-horizontal MuiToggleButtonGroup-variantSoft MuiToggleButtonGroup-colorNeutral MuiToggleButtonGroup-sizeSm form-control valid css-1j6p1b3-JoyToggleButtonGroup-root"
            id="test-select-button"
            role="group"
          >
            <button
              class="MuiButton-root MuiButton-variantSoft MuiButton-colorNeutral MuiButton-sizeSm css-10h9hac-JoyButton-root"
              data-first-child=""
              data-last-child=""
              id="test-test-select-button"
              type="button"
              value="test"
            >
              Test
            </button>
          </div>
        </div>
      `);
    });
    it('display a textbox', async () => {
      const config: FieldConfiguration<TextboxConfiguration> = {
        ...baseConfig,
        controlType: ControlTypeEnum.Textbox,
      };
      const field = await getField(config);

      expect(field).toBeTruthy();
      expect(field).toMatchInlineSnapshot(`
        <div
          class="field "
          data-testid="test-field"
          id="test-field"
        >
          <label
            class="label"
            data-testid="test-field-label"
          >
             
            First Name
            <span
              class="required"
            >
               *
            </span>
          </label>
          <input
            class="form-control valid"
            data-testid="test-textbox"
            id="test-textbox"
            type="text"
            value=""
          />
        </div>
      `);
    });
  });

  describe('Hidden and Readonly', () => {
    it('displays nothing if the field is hidden', () => {
      render(<Field config={{ ...baseConfig, isReadonly: true }} />);
      const field = screen.queryAllByRole('textbox')?.[0];

      expect(field).toBeUndefined();
    });
    it('displays a readonly field if field isReadonly', () => {
      render(<Field config={{ ...baseConfig, isReadonly: true }} />);
      const readonlyField = screen.getAllByTestId(
        'First Name-readonly-field'
      )?.[0];

      expect(readonlyField).toBeTruthy();
      expect(readonlyField).toMatchInlineSnapshot(`
        <div
          class="readonly-field"
          data-testid="First Name-readonly-field"
        >
          <div
            class="label"
          >
            First Name
          </div>
          <div
            class="value"
          />
          <small
            class="hint"
          />
        </div>
      `);
    });
  });
});
