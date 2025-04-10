import { ControlTypeEnum } from '../constants';
import {
  CheckboxConfiguration,
  ControlOption,
  DatePickerConfiguration,
  FieldConfiguration,
  FieldRule,
  FieldRuleEffectedField,
  FieldRuleProcessEvent,
  FieldRuleUpdateEvent,
  getDefaultFieldConfiguration,
  NumberConfiguration,
  TextboxConfiguration,
} from '../models';
import { processFieldRules } from './field-rules';

describe('FieldRules', () => {
  describe('processFieldRules', () => {
    const event: FieldRuleProcessEvent = {
      action: FieldRuleUpdateEvent.onChange,
      fieldName: 'ageOrDateOfBirth',
      value: 'dateOfBirth',
    };
    const getFieldRule = (
      effectedFields: FieldRuleEffectedField[]
    ): FieldRule => {
      return {
        fieldName: 'ageOrDateOfBirth',
        valueToMatch: 'dateOfBirth',
        updateOn: FieldRuleUpdateEvent.onChange,
        effectedFields,
      };
    };
    const getFieldConfig = (overrides: any): FieldConfiguration<any> => {
      return getDefaultFieldConfiguration({
        ...overrides,
        inputId: overrides.inputId ?? 'test',
        name: overrides.name ??'test',
        controlType: overrides.controlType ?? ControlTypeEnum.Textbox,
        controlConfig: {
          ...overrides.controlConfig,
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
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isHidden: false, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isHidden: true,
          name: 'dateOfBirth',
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isHidden: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isHidden: false,
          name: 'dateOfBirth',
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
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isRequired: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isRequired: false,
          name: 'dateOfBirth',
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isRequired: false, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isRequired: true,
          name: 'dateOfBirth',
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', isDisabled: false }),
        getFieldConfig({
          name: 'dateOfBirth',
          isDisabled: true,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', isDisabled: true }),
        getFieldConfig({
          name: 'dateOfBirth',
          isDisabled: false,
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
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isReadonly: false, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isReadonly: true,
          name: 'dateOfBirth',
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isReadonly: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isReadonly: false,
          name: 'dateOfBirth',
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          name: 'age',
          controlConfig: {
            min: undefined,
            max: undefined,
          } as NumberConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          name: 'age',
          controlConfig: {
            min: 18,
            max: 99,
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          name: 'age',
          controlConfig: {
            min: undefined,
            max: undefined,
          } as NumberConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.Number,
          name: 'age',
          controlConfig: { min: 1997, max: 1916 },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          name: 'age',
          controlConfig: {
            minDate: undefined,
            maxDate: undefined,
          } as DatePickerConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          name: 'age',
          controlConfig: {
            minDate: '1999-12-31',
            maxDate: '2030-01-01',
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
                    // note: UTC months are 0 based, January is 0, December is 11
                    const today = new Date(Date.UTC(2015, 10, 1));
                    const minDate = today.setUTCFullYear(
                      today.getUTCFullYear() - data.maxAge
                    );

                    return new Date(minDate).toUTCString();
                  },
                },
                {
                  action: 'setMaxDate',
                  value: (data: any) => {
                    const today = new Date(Date.UTC(2015, 10, 1));
                    const maxDate = today.setUTCFullYear(
                      today.getUTCFullYear() - data.minAge
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          name: 'age',
          controlConfig: {
            minDate: undefined,
            maxDate: undefined,
          } as DatePickerConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          controlType: ControlTypeEnum.DatePicker,
          name: 'age',
          controlConfig: {
            maxDate: 'Sat, 01 Nov 1997 00:00:00 GMT',
            minDate: 'Wed, 01 Nov 1916 00:00:00 GMT',
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: {
            minLength: undefined,
            maxLength: undefined,
          },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: { minLength: 4, maxLength: 9 },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: {
            minLength: undefined,
            maxLength: undefined,
          },
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: {
            minLength: data.minPolicyNumbers,
            maxLength: data.maxPolicyNumbers,
          },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({
          name: 'dateOfBirth',
          controlConfig: {
            pattern: undefined,
          } as TextboxConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({
          name: 'dateOfBirth',
          controlConfig: {
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
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({
          name: 'dateOfBirth',
          controlConfig: {
            pattern: undefined,
          } as TextboxConfiguration,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({
          name: 'dateOfBirth',
          controlConfig: {
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', value: undefined }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', value: 25 }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', value: undefined }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', value: 30 }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
      const options: ControlOption[] = [
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: {
            options: [{} as any],
          } as CheckboxConfiguration,
          value: undefined,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({ name: 'age', controlConfig: { options } }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: {
            options: [{} as any],
          } as CheckboxConfiguration,
          value: undefined,
        }),
      ];
      const expectedValue: FieldConfiguration<any>[] = [
        getFieldConfig({ name: 'ageOrDateOfBirth' }),
        getFieldConfig({
          name: 'age',
          controlConfig: { options: data.foreverRoyals },
        }),
      ];
      const event: FieldRuleProcessEvent = {
        action: FieldRuleUpdateEvent.onChange,
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
        action: FieldRuleUpdateEvent.onChange,
        fieldName: 'dateOfBirth',
        value: '1985-10-27',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isRequired: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isRequired: false,
          name: 'dateOfBirth',
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
        action: FieldRuleUpdateEvent.onBlur,
        fieldName: 'ageOrDateOfBirth',
        value: 'dateOfBirth',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isRequired: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isRequired: false,
          name: 'dateOfBirth',
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
        action: FieldRuleUpdateEvent.onChange,
        fieldName: 'ageOrDateOfBirth',
        value: 'dateOfBirth',
      };
      const fieldConfigs: FieldConfiguration<any>[] = [
        getFieldConfig({
          name: 'ageOrDateOfBirth',
          inputId: 'ageOrDateOfBirth',
        }),
        getFieldConfig({ isRequired: true, name: 'age', inputId: 'age' }),
        getFieldConfig({
          isRequired: false,
          name: 'dateOfBirth',
        }),
      ];
      const returnValue = processFieldRules(event, fieldConfigs, fieldRules);

      expect(returnValue).toEqual(fieldConfigs);
    });
  });
});
