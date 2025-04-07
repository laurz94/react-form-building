import { ControlTypeEnum } from '../enums';
import {
  DatePickerConfiguration,
  FieldConfiguration,
  NumberConfiguration,
  TextboxConfiguration,
} from '../models';
import { isValueEmpty, validateField } from './validate-field';

describe('Validate Field', () => {
  describe('validateField', () => {
    describe('isRequired', () => {
      const field: FieldConfiguration<any> = {
        controlType: ControlTypeEnum.Textbox,
        isRequired: true,
        label: 'Age',
        controlConfig: { inputId: 'age', name: 'age', isDisabled: false },
      };
      const value = 0;
      it('return an error message when the value is not supplied', () => {
        const thisField = { ...field, requiredErrorMessage: undefined };
        const expectedValue = [`${field.label} is a required field.`];
        const testValue = validateField(thisField, undefined);

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is supplied', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, value);

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('minLength', () => {
      const field: FieldConfiguration<TextboxConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        label: 'Age',
        controlConfig: {
          minLength: 2,
        },
      };
      it('return an error message when the value is less than minLength', () => {
        const expectedValue = [
          `${field.label} must be at least ${field.controlConfig.minLength} characters.`,
        ];
        const testValue = validateField(field, '2');

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is greater than minLength', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, '29');

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('maxLength', () => {
      const field: FieldConfiguration<TextboxConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Age',
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        controlConfig: {
          maxLength: 2,
        },
      };
      it('return an error message when the value is greater than maxLength', () => {
        const expectedValue = [
          `${field.label} cannot be more than ${field.controlConfig.maxLength} characters.`,
        ];
        const testValue = validateField(field, '290');

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is less than maxLength', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, '2');

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('min', () => {
      const field: FieldConfiguration<NumberConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Age',
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        controlConfig: {
          min: 2,
          isCurrency: false,
          decimalPlaces: 0,
        },
      };
      it('return an error message when the value is less than min', () => {
        const expectedValue = [
          `${field.label} must be no less than ${field.controlConfig.min}.`,
        ];
        const testValue = validateField(field, 1);

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is greater than min', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, 3);

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('max', () => {
      const field: FieldConfiguration<NumberConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Age',
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        controlConfig: {
          max: 2,
          isCurrency: false,
          decimalPlaces: 0,
        },
      };
      it('return an error message when the value is greater than max', () => {
        const expectedValue = [
          `${field.label} must be no greater than ${field.controlConfig.max}.`,
        ];
        const testValue = validateField(field, 29);

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is less than max', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, 1);

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('minDate', () => {
      const field: FieldConfiguration<DatePickerConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Age',
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        controlConfig: {
          minDate: '2000-01-01',
        },
      };
      it('return an error message when the value is less than minDate', () => {
        const expectedValue = [
          `${field.label} must be no less than ${field.controlConfig.minDate}.`,
        ];
        const testValue = validateField(field, '1999-12-31');

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is greater than minDate', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, '2001-01-01');

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('maxDate', () => {
      const field: FieldConfiguration<DatePickerConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Age',
        inputId: 'age',
        name: 'age',
        isDisabled: false,
        controlConfig: {
          maxDate: '2020-03-13',
        },
      };
      it('return an error message when the value is greater than maxDate', () => {
        const expectedValue = [
          `${field.label} must be no greater than ${field.controlConfig.maxDate}.`,
        ];
        const testValue = validateField(field, '2025-03-25');

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value is less than maxDate', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, '2020-03-12');

        expect(testValue).toEqual(expectedValue);
      });
    });
    describe('pattern', () => {
      const field: FieldConfiguration<TextboxConfiguration> = {
        controlType: ControlTypeEnum.Textbox,
        label: 'Policy Number',
        inputId: 'policy-number',
        name: 'policy-number',
        isDisabled: false,
        controlConfig: {
          pattern: '^AM[0-9]+$',
        },
      };
      it('return an error message when the value does not match the pattern', () => {
        const expectedValue = [
          `${field.label} is not formatted correctly. Please check your value and try again.`,
        ];
        const testValue = validateField(field, 'AMERICO123456789');

        expect(testValue).toEqual(expectedValue);
      });

      it('return an empty array when value matches the pattern', () => {
        const expectedValue: string[] = [];
        const testValue = validateField(field, 'AM123456789');

        expect(testValue).toEqual(expectedValue);
      });
    });
  });

  describe('isValueEmpty', () => {
    it('return true when value is null', () => {
      expect(isValueEmpty(null)).toEqual(true);
    });
    it('return true when value is undefined', () => {
      expect(isValueEmpty(undefined)).toEqual(true);
    });
    it('return true when value is an empty string', () => {
      expect(isValueEmpty('')).toEqual(true);
    });
    it('return true when value is an empty array', () => {
      expect(isValueEmpty([])).toEqual(true);
    });
    it('return true when value is an empty object', () => {
      expect(isValueEmpty({})).toEqual(true);
    });
    it('return false when value is 0', () => {
      expect(isValueEmpty(0)).toEqual(false);
    });
    it('return false when value is a string', () => {
      expect(isValueEmpty('string')).toEqual(false);
    });
    it('return false when value is an Array', () => {
      expect(isValueEmpty(['string', 'array'])).toEqual(false);
    });
    it('return false when value is an object', () => {
      expect(isValueEmpty({ name: 'Burt' })).toEqual(false);
    });
  });
});
