import { fireEvent, render, screen } from '@testing-library/react';

import {
  ControlTypeEnum,
  FieldConfiguration,
  FieldRule,
} from '@libs/domain';
import Form from './form.js';

describe('Form', () => {
  const baseConfig: FieldConfiguration<any> = {
    controlType: ControlTypeEnum.Textbox,
    controlConfig: {
      inputId: 'test',
      name: 'test',
      isDisabled: false,
    },
    isRequired: true,
    isReadonly: false,
    label: 'First Name',
  };
  const fields: FieldConfiguration<any>[] = [
    { ...baseConfig },
    {
      ...baseConfig,
      label: 'Last Name',
      controlConfig: {
        ...baseConfig.controlConfig,
        inputId: 'test2',
        name: 'test2',
      },
    },
  ];
  it('should render successfully', () => {
    const { baseElement } = render(<Form fields={fields} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <form
            class="form"
          >
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
            <div
              class="field "
              data-testid="test2-field"
              id="test2-field"
            >
              <label
                class="label"
                data-testid="test2-field-label"
              >
                 
                Last Name
                <span
                  class="required"
                >
                   *
                </span>
              </label>
              <input
                class="form-control valid"
                data-testid="test2-textbox"
                id="test2-textbox"
                type="text"
                value=""
              />
            </div>
          </form>
        </div>
      </body>
    `);
  });

  describe('FieldRules', () => {
    const handleBlur = jest.fn();
    const handleChange = jest.fn();
    const handleFocus = jest.fn();
    const processFieldRules = jest.fn();
    const rules: FieldRule[] = [
      {
        fieldName: 'test',
        updateOn: 'blur',
        valueToMatch: true,
        effectedFields: [{ name: 'test2', actions: [{ action: 'require' }] }],
      },
    ];
    const form = () => {
      render(
        <Form
          fields={fields}
          fieldRules={rules}
          onChanged={handleChange}
          onBlurred={handleBlur}
          onFocused={handleFocus}
        />
      );
      const inputElement = screen.getAllByTestId('test-textbox')?.[0];

      return inputElement;
    };

    it('when a rule processes to hide the control, it does not exist on the form', () => {
      const inputElement = form();
      fireEvent.focus(inputElement);
      fireEvent.blur(inputElement);
      const elementsOnForm = screen.getAllByRole('form');

      expect(handleBlur).toHaveBeenCalledTimes(1);
      expect(elementsOnForm).toMatchInlineSnapshot();
    });
  });

});
