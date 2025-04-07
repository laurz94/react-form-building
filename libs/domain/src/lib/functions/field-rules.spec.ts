import { ControlTypeEnum } from '../enums';
import {
  CheckboxConfiguration,
  CheckboxOption,
  DatePickerConfiguration,
  FieldConfiguration,
  FieldRule,
  FieldRuleEffectedField,
  FieldRuleProcessEvent,
  getDefaultFieldConfiguration,
  NumberConfiguration,
  TextboxConfiguration,
} from '../models';
import { processFieldRules } from './field-rules';

describe('FieldRules', () => {
  describe('processFieldRules', () => {
    const event: FieldRuleProcessEvent = {
      action: 'change',
      fieldName: 'ageOrDateOfBirth',
      value: 'dateOfBirth',
    };
    const getFieldRule = (
      effectedFields: FieldRuleEffectedField[]
    ): FieldRule => {
      return {
        fieldName: 'ageOrDateOfBirth',
        valueToMatch: 'dateOfBirth',
        updateOn: 'change',
        effectedFields,
      };
    };
    const getFieldConfig = (
      overrides: any
    ): FieldConfiguration<any> => {
      return getDefaultFieldConfiguration({
        ...overrides,
        controlType: overrides.controlType ?? ControlTypeEnum.Textbox,
        controlConfig: {
          ...overrides.controlConfig,
          inputId: 'test',
        },
      });
    };

    it('process the event to hide one field and show another', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'show' }],
          },
          {
            name: 'age',
            actions: [{ action: 'hide' }],
          },
        ]),
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isHidden: false, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isHidden: true,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isHidden: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isHidden: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set a field to be required and another to be optional', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'require' }],
          },
          {
            name: 'age',
            actions: [{ action: 'optional' }],
          },
        ]),
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isRequired: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isRequired: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isRequired: false, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isRequired: true,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to disable one field and enable another', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'enable' }],
          },
          {
            name: 'age',
            actions: [{ action: 'disable' }],
          },
        ]),
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age', isDisabled: false } }),
        getFieldConfig({
          controlConfig: { name: 'dateOfBirth', isDisabled: true },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age', isDisabled: true } }),
        getFieldConfig({
          controlConfig: { name: 'dateOfBirth', isDisabled: false },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to mark one field readonly and enable another', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'editable' }],
          },
          {
            name: 'age',
            actions: [{ action: 'readonly' }],
          },
        ]),
      ];

      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isReadonly: false, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isReadonly: true,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isReadonly: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isReadonly: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max values', () => {
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                { action: 'setMin', value: 18 },
                { action: 'setMax', value: 99 },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          controlConfig: {
            name: 'age',
            min: undefined,
            max: undefined,
          } as NumberConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          controlConfig: { name: 'age', min: 18, max: 99 },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max values from functions', () => {
      const data = { minAge: 18, maxAge: 99 };
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                {
                  action: 'setMin',
                  value: (data: any) =>
                    new Date('2015-11-01').getFullYear() - data.minAge,
                },
                {
                  action: 'setMax',
                  value: (data: any) =>
                    new Date('2015-11-01').getFullYear() - data.maxAge,
                },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          controlConfig: {
            name: 'age',
            min: undefined,
            max: undefined,
          } as NumberConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          controlConfig: { name: 'age', min: 1997, max: 1916 },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(
        event,
        fieldConfigs,
        fieldRules,
        data
      );

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max dates', () => {
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                { action: 'setMinDate', value: '1999-12-31' },
                { action: 'setMaxDate', value: '2030-01-01' },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          controlConfig: {
            name: 'age',
            minDate: undefined,
            maxDate: undefined,
          } as DatePickerConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          controlConfig: {
            name: 'age',
            minDate: '1999-12-31',
            maxDate: '2030-01-01',
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max dates from value function', () => {
      const data = { minAge: 18, maxAge: 99 };
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                {
                  action: 'setMinDate',
                  value: (data: any) => {
                    const today = new Date('2015-11-01');
                    const minDate = today.setFullYear(
                      today.getFullYear() - data.minAge
                    );

                    return new Date(minDate).toUTCString();
                  },
                },
                {
                  action: 'setMaxDate',
                  value: (data: any) => {
                    const today = new Date('2015-11-01');
                    const maxDate = today.setFullYear(
                      today.getFullYear() - data.maxAge
                    );

                    return new Date(maxDate).toUTCString();
                  },
                },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          controlConfig: {
            name: 'age',
            minDate: undefined,
            maxDate: undefined,
          } as DatePickerConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          controlConfig: {
            name: 'age',
            minDate: 'Sat, 01 Nov 1997 01:00:00 GMT',
            maxDate: 'Wed, 01 Nov 1916 01:00:00 GMT',
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(
        event,
        fieldConfigs,
        fieldRules,
        data
      );

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max lengths', () => {
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                { action: 'setMinLength', value: 4 },
                { action: 'setMaxLength', value: 9 },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: {
            name: 'age',
            minLength: undefined,
            maxLength: undefined,
          },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: { name: 'age', minLength: 4, maxLength: 9 },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set min & max lengths from functions', () => {
      const data = { minPolicyNumbers: 3, maxPolicyNumbers: 25 };
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                {
                  action: 'setMinLength',
                  value: (data: any) => data.minPolicyNumbers,
                },
                {
                  action: 'setMaxLength',
                  value: (data: any) => data.maxPolicyNumbers,
                },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: {
            name: 'age',
            minLength: undefined,
            maxLength: undefined,
          },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: {
            name: 'age',
            minLength: data.minPolicyNumbers,
            maxLength: data.maxPolicyNumbers,
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(
        event,
        fieldConfigs,
        fieldRules,
        data
      );

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field pattern', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [
              { action: 'setPattern', value: /^[0-9]{2}-[0-9]{2}-[0-9]{4}/ },
            ],
          },
        ]),
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({
          controlConfig: {
            name: 'dateOfBirth',
            pattern: undefined,
          } as TextboxConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({
          controlConfig: {
            name: 'dateOfBirth',
            pattern: /^[0-9]{2}-[0-9]{2}-[0-9]{4}/,
          } as TextboxConfiguration,
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field pattern from a function', () => {
      const data = { dateRegEx: /^[0-9]{2}-[0-9]{2}-[0-9]{4}/ };
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [
              { action: 'setPattern', value: (data: any) => data.dateRegEx },
            ],
          },
        ]),
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({
          controlConfig: {
            name: 'dateOfBirth',
            pattern: undefined,
          } as TextboxConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({
          controlConfig: {
            name: 'dateOfBirth',
            pattern: /^[0-9]{2}-[0-9]{2}-[0-9]{4}/,
          } as TextboxConfiguration,
        }),
      ];
      const returnValue = processFieldRules(
        event,
        fieldConfigs,
        fieldRules,
        data
      );

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field value', () => {
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [{ action: 'setValue', value: 25 }],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age' }, value: undefined }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age' }, value: 25 }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field value from a function', () => {
      const data = { dateOfBirth: '1985-10-27' };
      const today = new Date('2015-11-01').getTime();
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                {
                  action: 'setValue',
                  value: (data: any) =>
                    Math.abs(
                      new Date(
                        today - new Date(data.dateOfBirth).getTime()
                      ).getUTCFullYear() - 1970 // UNIX epoch
                    ),
                },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age' }, value: undefined }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age' }, value: 30 }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(
        event,
        fieldConfigs,
        fieldRules,
        data
      );

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field options', () => {
      const options: CheckboxOption[] = [
        { label: 'Salvador Perez', value: 'Salvi' },
        { label: 'Yordano Ventura', value: 'RIP Ventura' },
        { label: 'Alex Gordon', value: 'Gordo' },
        { label: 'Eric Hosmer', value: 'Hoz' },
        { label: 'Mike Moustakas', value: 'Moooooooooose' },
        { label: 'Lorenzo Cain', value: 'Lo Cain' },
        { label: 'Danny Duffy', value: 'Duff Man' },
      ];
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [{ action: 'setOptions', value: options }],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: {
            name: 'age',
            options: [{}],
          } as CheckboxConfiguration,
          value: undefined,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({ controlConfig: { name: 'age', options } }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(expectedValue);
    });

    it('process the event to set the field options from a function', () => {
      const data = {
        foreverRoyals: [
          { label: 'Salvador Perez', value: 'Salvi' },
          { label: 'Yordano Ventura', value: 'RIP Ventura' },
          { label: 'Alex Gordon', value: 'Gordo' },
          { label: 'Eric Hosmer', value: 'Hoz' },
          { label: 'Mike Moustakas', value: 'Moooooooooose' },
          { label: 'Lorenzo Cain', value: 'Lo Cain' },
          { label: 'Danny Duffy', value: 'Duff Man' },
        ],
      };
      const fieldRules = [
        {
          ...getFieldRule([
            {
              name: 'age',
              actions: [
                {
                  action: 'setOptions',
                  value: (data: any) => data.foreverRoyals,
                },
              ],
            },
          ]),
          valueToMatch: 'age',
        },
      ];
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: {
            name: 'age',
            options: [{}],
          } as CheckboxConfiguration,
          value: undefined,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ controlConfig: { name: 'ageOrDateOfBirth' } }),
        getFieldConfig({
          controlConfig: { name: 'age', options: data.foreverRoyals },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'age',
      };
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules, data);

      expect(returnValue).toEqual(expectedValue);
    });

    it('if the event does not match a field rule, the configuration should return as is', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'require' }],
          },
          {
            name: 'age',
            actions: [{ action: 'optional' }],
          },
        ]),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'dateOfBirth',
        value: '1985-10-27',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isRequired: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isRequired: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(fieldConfigs);
    });

    it('if the event action does not match a field rule updateOn, the configuration should return as is', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'require' }],
          },
          {
            name: 'age',
            actions: [{ action: 'optional' }],
          },
        ]),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'blur',
        fieldName: 'ageOrDateOfBirth',
        value: 'dateOfBirth',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isRequired: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isRequired: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(fieldConfigs);
    });

    it('if the effected field is not properly configured, the configuration should return as is', () => {
      const fieldRules = [
        getFieldRule([
          {
            name: 'dateOfBirth',
            actions: [{ action: 'nonsense' as any }],
          },
          {
            name: 'age',
            actions: [{ action: 'nonsense' as any }],
          },
        ]),
      ];
      const event: FieldRuleProcessEvent = {
        action: 'change',
        fieldName: 'ageOrDateOfBirth',
        value: 'dateOfBirth',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          controlConfig: { name: 'ageOrDateOfBirth' },
        }),
        getFieldConfig({ isRequired: true, controlConfig: { name: 'age' } }),
        getFieldConfig({
          isRequired: false,
          controlConfig: { name: 'dateOfBirth' },
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(fieldConfigs);
    });
  });
});

