/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';

import {
  ControlTypeEnum,
  FieldConfiguration,
  FieldRule,
  FieldRuleUpdateEvent,
  FormFieldType,
  FormLevel,
} from '@libs/domain';
import Form from './form.js';

describe('Form', () => {
  const baseConfig: FieldConfiguration<any> = {
    controlType: ControlTypeEnum.Textbox,
    inputId: 'test',
    name: 'test',
    isDisabled: false,
    isRequired: true,
    isReadonly: false,
    label: 'First Name',
    controlConfig: {} as any,
  };
  const fields: FormFieldType[] = [
    { ...baseConfig },
    {
      ...baseConfig,
      label: 'Last Name',
      inputId: 'test2',
      name: 'test2',
      controlConfig: {
        ...baseConfig.controlConfig,
      },
    },
  ];
  it('should render successfully', () => {
    const { baseElement } = render(<Form name='Test-Form' title='Test Form' level={FormLevel.page} fields={fields} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchInlineSnapshot();
  });

  describe('FieldRules', () => {
    const handleBlur = jest.fn();
    const handleChange = jest.fn();

    const rules: FieldRule[] = [
      {
        fieldName: 'test',
        updateOn: FieldRuleUpdateEvent.onBlur,
        valueToMatch: 'George Brett',
        effectedFields: [{ name: 'test2', actions: [{ action: 'hide' }] }],
      },
    ];
    const form = () => {
      render(
        <Form
          name='Test-Form'
          title='Test Form'
          level={FormLevel.page}
          fields={fields}
          fieldRules={rules}
          onBlurred={handleBlur}
          onChanged={handleChange}
        />,
      );
      const inputElement = screen.getAllByTestId('test-textbox')?.[0];

      return inputElement;
    };

    it('when a rule processes to hide the control, it does not exist on the form', () => {
      const inputElement = form();
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: 'George Brett' } });
      fireEvent.blur(inputElement);
      const elementsOnForm = screen.getAllByRole('form');

      expect(elementsOnForm).toMatchInlineSnapshot();
    });
  });
});
